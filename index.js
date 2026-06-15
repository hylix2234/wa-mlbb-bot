import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import { CONFIG } from "./config.js";
import { getMenu, getCaraOrder, getAdmin } from "./handlers/menu.js";
import { getHargaDiamond, getHargaWDP, getHargaStarlight } from "./handlers/harga.js";
import { getPayment } from "./handlers/payment.js";

// ─── Logger minimal (supaya terminal tidak penuh log Baileys) ───
const logger = pino({ level: "silent" });

// ─── Set untuk track pesan welcome (agar tidak kirim 2x) ────────
const welcomed = new Set();

// ─── Fungsi utama ────────────────────────────────────────────────
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

  // ─── Simpan kredensial saat ada perubahan ──────────────────────
  sock.ev.on("creds.update", saveCreds);

  // ─── Handle koneksi ───────────────────────────────────────────
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("\n🔗 Scan QR Code di atas dengan WhatsApp kamu!\n");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log(
        "❌ Koneksi terputus:",
        lastDisconnect?.error?.message ?? "Unknown error"
      );

      if (shouldReconnect) {
        console.log("🔄 Mencoba reconnect...");
        setTimeout(startBot, 3000);
      } else {
        console.log("🚫 Logged out. Hapus folder auth_info lalu jalankan ulang.");
      }
    }

    if (connection === "open") {
      console.log(`\n✅ Bot ${CONFIG.NAMA_TOKO} berhasil terhubung!\n`);
    }
  });

  // ─── Handle pesan masuk ───────────────────────────────────────
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      // Abaikan pesan dari diri sendiri
      if (msg.key.fromMe) continue;

      // Abaikan pesan grup (bot khusus private)
      if (msg.key.remoteJid?.endsWith("@g.us")) continue;

      const jid = msg.key.remoteJid;
      if (!jid) continue;

      // Ambil teks pesan
      const teks =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        "";

      const teksLower = teks.trim().toLowerCase();

      // Nama pengirim
      const senderName =
        msg.pushName || jid.replace("@s.whatsapp.net", "");

      // ── Welcome otomatis saat pertama chat ──────────────────
      if (CONFIG.WELCOME && !welcomed.has(jid)) {
        welcomed.add(jid);
        await kirim(sock, jid, getMenu(senderName));
        continue;
      }

      // ── Routing perintah ────────────────────────────────────
      const prefix = CONFIG.PREFIX;

      if (
        teksLower === `${prefix}menu` ||
        teksLower === "menu" ||
        teksLower === "halo" ||
        teksLower === "hi" ||
        teksLower === "hai"
      ) {
        await kirim(sock, jid, getMenu(senderName));
      } else if (teksLower === `${prefix}diamond` || teksLower === "diamond") {
        await kirim(sock, jid, getHargaDiamond());
      } else if (teksLower === `${prefix}wdp` || teksLower === "wdp") {
        await kirim(sock, jid, getHargaWDP());
      } else if (
        teksLower === `${prefix}starlight` ||
        teksLower === "starlight"
      ) {
        await kirim(sock, jid, getHargaStarlight());
      } else if (
        teksLower === `${prefix}payment` ||
        teksLower === "payment" ||
        teksLower === "bayar" ||
        teksLower === "metode"
      ) {
        await kirim(sock, jid, getPayment());
      } else if (teksLower === `${prefix}order` || teksLower === "order") {
        await kirim(sock, jid, getCaraOrder());
      } else if (
        teksLower === `${prefix}admin` ||
        teksLower === "admin" ||
        teksLower === "cs"
      ) {
        await kirim(sock, jid, getAdmin());
      } else if (teks.trim() !== "") {
        // Pesan tidak dikenal → tampilkan menu
        await kirim(
          sock,
          jid,
          `❓ Perintah tidak dikenal.\n\nKetik *${prefix}menu* untuk melihat daftar perintah.`
        );
      }
    }
  });
}

// ─── Helper kirim pesan teks ─────────────────────────────────────
async function kirim(sock, jid, teks) {
  try {
    await sock.sendMessage(jid, { text: teks });
  } catch (err) {
    console.error("❌ Gagal kirim pesan:", err.message);
  }
}

// ─── Jalankan bot ─────────────────────────────────────────────────
startBot().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});