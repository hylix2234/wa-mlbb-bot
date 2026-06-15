import { HARGA_DIAMOND, HARGA_WDP, HARGA_STARLIGHT } from "../config.js";

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

export function getHargaDiamond() {
  let pesan =
    `💎 *DAFTAR HARGA DIAMOND MLBB*\n` +
    `─────────────────────────────\n`;

  for (const item of HARGA_DIAMOND) {
    pesan += `• ${item.jumlah.padEnd(14)} → *${formatRupiah(item.harga)}*\n`;
  }

  pesan +=
    `─────────────────────────────\n` +
    `✅ Top up langsung ke akun MLBB\n` +
    `⚡ Proses cepat 1–15 menit\n\n` +
    `Ketik *!order* untuk cara order.`;

  return pesan;
}

export function getHargaWDP() {
  let pesan =
    `📅 *WEEKLY DIAMOND PASS (WDP)*\n` +
    `─────────────────────────────\n`;

  for (const item of HARGA_WDP) {
    pesan +=
      `• *${item.paket}*\n` +
      `  Bonus  : ${item.bonus}\n` +
      `  Harga  : *${formatRupiah(item.harga)}*\n\n`;
  }

  pesan +=
    `─────────────────────────────\n` +
    `📌 WDP aktif langsung setelah pembayaran\n` +
    `⚡ Proses: 1–15 menit\n\n` +
    `Ketik *!order* untuk cara order.`;

  return pesan;
}

export function getHargaStarlight() {
  let pesan =
    `⭐ *STARLIGHT MEMBER MLBB*\n` +
    `─────────────────────────────\n`;

  for (const item of HARGA_STARLIGHT) {
    pesan +=
      `• *${item.paket}*\n` +
      `  Durasi : ${item.durasi}\n` +
      `  Harga  : *${formatRupiah(item.harga)}*\n\n`;
  }

  pesan +=
    `─────────────────────────────\n` +
    `📌 Starlight memberikan skin eksklusif & bonus harian\n` +
    `⚡ Proses: 1–15 menit\n\n` +
    `Ketik *!order* untuk cara order.`;

  return pesan;
}