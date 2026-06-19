import { CONFIG } from "../config.js";

const PREFIX = "!";
const { NAMA_TOKO, NO_ADMIN } = CONFIG;

export function getMenu(senderName) {
  return (
    `╔══════════════════════════╗\n` +
    `║   ${NAMA_TOKO}   ║\n` +
    `╚══════════════════════════╝\n\n` +
    `Halo, *${senderName}* 👋\n` +
    `Selamat datang di toko kami!\n\n` +
    `📋 *MENU UTAMA*\n` +
    `─────────────────────────\n` +
    `💎 *${PREFIX}diamond* — Daftar harga Diamond\n` +
    `📅 *${PREFIX}wdp*     — Daftar harga Weekly Diamond Pass\n` +
    `⭐ *${PREFIX}starlight* — Daftar harga Starlight Member\n` +
    `💳 *${PREFIX}payment* — Metode pembayaran\n` +
    `🛒 *${PREFIX}order*   — Cara order\n` +
    `📞 *${PREFIX}admin*   — Hubungi admin\n\n` +
    `─────────────────────────\n` +
    `_Ketik perintah di atas untuk informasi lengkap._`
  );
}

export function getCaraOrder() {
  return (
    `🛒 *CARA ORDER*\n` +
    `─────────────────────────\n` +
    `1️⃣ Pilih produk & nominal yang diinginkan\n` +
    `2️⃣ Kirim format order ke admin:\n\n` +
    `*Format Order:*\n` +
    `\`\`\`\n` +
    `ID+Server: [ID MLBB+server]\n` +
    `Produk   : [Diamond/WDP/Starlight]\n` +
    `Payment  : [metode bayar]\n` +
    `\`\`\`\n\n` +
    `3⃣Lakukan pembayaran\n` +
    `4⃣Kirim bukti transfer ke admin\n` +
    `─────────────────────────\n` +
    `⚡ Proses: *1–15 menit* setelah pembayaran\n` +
    `📞 Hubungi admin: wa.me/${NO_ADMIN}`
  );
}

export function getAdmin() {
  return (
    `📞 *HUBUNGI ADMIN*\n` +
    `─────────────────────────\n` +
    `👤 Admin: *${CONFIG.NAMA_ADMIN}*\n` +
    `📱 WhatsApp: wa.me/${NO_ADMIN}\n\n` +
    `🕐 *Jam Operasional:*\n` +
    `Senin – Minggu: 08.00 – 22.00 WIB\n\n` +
    `_Di luar jam operasional, pesan akan dibalas saat online._`
  );
}
