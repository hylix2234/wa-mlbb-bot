import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { readFileSync, writeFileSync } from "fs";
import { CONFIG } from "./config.js";
import { getMenu, getCaraOrder, getAdmin } from "./handlers/menu.js";
import { getHargaDiamond, getHargaWDP, getHargaStarlight } from "./handlers/harga.js";
import { sendPayment } from "./handlers/payment.js";

const logger = pino({ level: "silent" });
const ID_GRUP = "120363381410416926@g.us";
const JADWAL_FILE = "./jadwal.json";

// ─── Load & Save jadwal ──────────────────────────────────────
function loadJadwal() {
  try {
    return JSON.parse(readFileSync(JADWAL_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveJadwal(data) {
  writeFileSync(JADWAL_FILE, JSON.stringify(data, null, 2));
}

// ─── Jadwal otomatis ─────────────────────────────────────────
function startJadwal(sock) {
  setInterval(() => {
    const now = new Date();
    const jam = now.getUTCHours() + 7;
    const menit = now.getUTCMinutes();
    const jamSekarang = `${String(jam >= 24 ? jam - 24 : jam).padStart(2, "0")}:${String(menit).padStart(2, "0")}`;

    const jadwal = loadJadwal();
    for (const j of jadwal) {
      if (j.jam === jamSekarang) {
        sock.sendMessage(ID_GRUP, { text: j.pesan }).catch(err =>
          console.error("❌ Gagal kirim jadwal:", err.message)
        );
      }
    }
  }, 60000);
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: true,
    browser: ["MLBB Store Bot", "Chrome", "1.0.0"],
    generateHighQualityLinkPreview: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("\n🔗 Scan QR Code di atas dengan WhatsApp kamu!\n");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Koneksi terputus:", lastDisconnect?.error?.message ?? "Unknown error");
      if (shouldReconnect) {
        console.log("🔄 Mencoba reconnect...");
        setTimeout(startBot, 3000);
      } else {
        console.log("🚫 Logged out. Hapus folder auth_info lalu jalankan ulang.");
      }
    }

    if (connection === "open") {
      console.log(`\n✅ Bot ${CONFIG.NAMA_TOKO} berhasil terhubung!\n`);
      startJadwal(sock);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      if (!jid) continue;

      const isGrup = jid.endsWith("@g.us");
      const isAdmin = jid === `${CONFIG.NO_ADMIN}@s.whatsapp.net` || 
                msg.key.participant === `${CONFIG.NO_ADMIN}@s.whatsapp.net` ||
                jid.includes("233470680891488");
      console.log(`JID: ${jid} | isAdmin: ${isAdmin} | NO_ADMIN: ${CONFIG.NO_ADMIN}@s.whatsapp.net`);
      const teks =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        "";

      const teksLower = teks.trim().toLowerCase();
      const teksAsli = teks.trim();
      const senderName = msg.pushName || jid.replace("@s.whatsapp.net", "");

      const prefixes = ["!", "#", "."];
      const cleanTeks = prefixes.reduce((t, p) => t.startsWith(p) ? t.slice(p.length) : t, teksLower);
      const cleanAsli = prefixes.reduce((t, p) => t.startsWith(p) ? t.slice(p.length) : t, teksAsli);

      // ── Command admin (private) ──────────────────────────────
      if (isAdmin && !isGrup) {

        // !listjadwal
        if (cleanTeks === "listjadwal") {
          const jadwal = loadJadwal();
          if (jadwal.length === 0) {
            await kirim(sock, jid, "📋 Belum ada jadwal.");
          } else {
            const list = jadwal.map((j, i) =>
              `${i + 1}. ⏰ ${j.jam}\n    ${j.pesan.slice(0, 60)}${j.pesan.length > 60 ? "..." : ""}`
            ).join("\n\n");
            await kirim(sock, jid, `📋 *DAFTAR JADWAL:*\n\n${list}`);
          }
          continue;
        }

        // !addjadwal 09:00 isi pesan
        if (cleanTeks.startsWith("addjadwal ")) {
          const parts = cleanAsli.slice("addjadwal ".length);
          const spasi = parts.indexOf(" ");
          if (spasi === -1) {
            await kirim(sock, jid, "❌ Format salah.\nContoh: *!addjadwal 09:00 Selamat pagi!*");
          } else {
            const jam = parts.slice(0, spasi);
            const pesan = parts.slice(spasi + 1);
            if (!/^\d{2}:\d{2}$/.test(jam)) {
              await kirim(sock, jid, "❌ Format jam salah. Gunakan HH:MM\nContoh: 09:00");
            } else {
              const jadwal = loadJadwal();
              jadwal.push({ jam, pesan });
              saveJadwal(jadwal);
              await kirim(sock, jid, `✅ Jadwal ditambahkan!\n⏰ Jam: ${jam}\n📝 Pesan: ${pesan}`);
            }
          }
          continue;
        }

        // !hapusjadwal 1
        if (cleanTeks.startsWith("hapusjadwal ")) {
          const no = parseInt(cleanTeks.slice("hapusjadwal ".length)) - 1;
          const jadwal = loadJadwal();
          if (isNaN(no) || no < 0 || no >= jadwal.length) {
            await kirim(sock, jid, `❌ Nomor jadwal tidak valid.\nKetik *!listjadwal* untuk melihat daftar.`);
          } else {
            const hapus = jadwal.splice(no, 1);
            saveJadwal(jadwal);
            await kirim(sock, jid, `✅ Jadwal jam ${hapus[0].jam} berhasil dihapus.`);
          }
          continue;
        }

        // !editjadwal 1 09:30 Pesan baru
        if (cleanTeks.startsWith("editjadwal ")) {
          const parts = cleanAsli.slice("editjadwal ".length).split(" ");
          const no = parseInt(parts[0]) - 1;
          const jam = parts[1];
          const pesan = parts.slice(2).join(" ");
          const jadwal = loadJadwal();
          if (isNaN(no) || no < 0 || no >= jadwal.length) {
            await kirim(sock, jid, `❌ Nomor jadwal tidak valid.\nKetik *!listjadwal* untuk melihat daftar.`);
          } else if (!jam || !/^\d{2}:\d{2}$/.test(jam)) {
            await kirim(sock, jid, "❌ Format jam salah.\nContoh: *!editjadwal 1 09:30 Pesan baru*");
          } else if (!pesan) {
            await kirim(sock, jid, "❌ Pesan tidak boleh kosong.");
          } else {
            jadwal[no] = { jam, pesan };
            saveJadwal(jadwal);
            await kirim(sock, jid, `✅ Jadwal diupdate!\n⏰ Jam: ${jam}\n📝 Pesan: ${pesan}`);
          }
          continue;
        }

        // !teskirim
        if (cleanTeks === "teskirim") {
          await sock.sendMessage(ID_GRUP, { text: "🔔 Tes kirim pesan terjadwal dari admin." });
          await kirim(sock, jid, "✅ Pesan tes berhasil dikirim ke grup.");
          continue;
        }

        // !adminmenu
        if (cleanTeks === "adminmenu") {
          await kirim(sock, jid,
            `🔧 *MENU ADMIN*\n` +
            `─────────────────────────\n` +
            `📋 *!listjadwal*\n` +
            `   Lihat semua jadwal\n\n` +
            `➕ *!addjadwal HH:MM pesan*\n` +
            `   Tambah jadwal baru\n\n` +
            `✏️ *!editjadwal no HH:MM pesan*\n` +
            `   Edit jadwal\n\n` +
            `🗑️ *!hapusjadwal no*\n` +
            `   Hapus jadwal\n\n` +
            `📤 *!teskirim*\n` +
            `   Tes kirim pesan ke grup`
          );
          continue;
        }
      }

      // ── Pesan di grup ────────────────────────────────────────
      if (isGrup) {
        if (jid !== ID_GRUP) continue;
        const adaPrefix = prefixes.some(p => teksLower.startsWith(p));
        if (!adaPrefix) continue;

        if (cleanTeks === "menu") {
          await sock.sendMessage(jid, {
            image: { url: "https://raw.githubusercontent.com/hylix2234/wa-mlbb-bot/refs/heads/main/file_000000006e6c7208bdedabef298a14dc.png" },
            caption: getMenu(senderName)
          });
        } else if (cleanTeks === "diamond") {
          await kirim(sock, jid, getHargaDiamond());
        } else if (cleanTeks === "wdp") {
          await kirim(sock, jid, getHargaWDP());
        } else if (cleanTeks === "starlight") {
          await kirim(sock, jid, getHargaStarlight());
        } else if (cleanTeks === "payment" || cleanTeks === "bayar" || cleanTeks === "metode") {
          await sendPayment(sock, jid);
        } else if (cleanTeks === "order") {
          await kirim(sock, jid, getCaraOrder());
        } else if (cleanTeks === "admin" || cleanTeks === "cs") {
          await kirim(sock, jid, getAdmin());
        }
        continue;
      }
      // Blokir private chat selain admin
      if (!isAdmin) continue;
      // ── Private chat biasa ───────────────────────────────────
      if (cleanTeks === "menu" || cleanTeks === "halo" || cleanTeks === "hi" || cleanTeks === "hai") {
        await sock.sendMessage(jid, {
          image: { url: "https://raw.githubusercontent.com/hylix2234/wa-mlbb-bot/refs/heads/main/file_000000006e6c7208bdedabef298a14dc.png" },
          caption: getMenu(senderName)
        });
      } else if (cleanTeks === "diamond") {
        await kirim(sock, jid, getHargaDiamond());
      } else if (cleanTeks === "wdp") {
        await kirim(sock, jid, getHargaWDP());
      } else if (cleanTeks === "starlight") {
        await kirim(sock, jid, getHargaStarlight());
      } else if (cleanTeks === "payment" || cleanTeks === "bayar" || cleanTeks === "metode") {
        await sendPayment(sock, jid);
      } else if (cleanTeks === "order") {
        await kirim(sock, jid, getCaraOrder());
      } else if (cleanTeks === "admin" || cleanTeks === "cs") {
        await kirim(sock, jid, getAdmin());
      } else if (teks.trim() !== "") {
        await kirim(sock, jid, `❓ Perintah tidak dikenal.\n\nKetik *!menu* untuk melihat daftar perintah.`);
      }
    }
  });
}

async function kirim(sock, jid, teks) {
  try {
    await sock.sendMessage(jid, { text: teks });
  } catch (err) {
    console.error("❌ Gagal kirim pesan:", err.message);
  }
}

startBot().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
