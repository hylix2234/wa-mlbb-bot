import { CONFIG } from "../config.js";

const { PREFIX, NAMA_TOKO, NO_ADMIN } = CONFIG;

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
    `Nama   : [nama akun MLBB]\n` +
    `ID     : [ID MLBB kamu]\n` +
    `Server : [Server / Zone]\n` +
    `Produk : [Diamond/WDP/Starlight]\n` +
    `Jumlah : [misal: 86 Diamond]\n` +
    `Payment: [metode bayar]\n` +
    `\`\`\`\n\n` +
    `3️⃣ Admin konfirmasi & kirim total harga\n` +
    `4️⃣ Lakukan pembayaran\n` +
    `5️⃣ Kirim bukti transfer ke admin\n` +
    `6️⃣ Diamond / item masuk ke akun kamu ✅\n\n` +
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