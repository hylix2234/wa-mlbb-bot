import { PAYMENT } from "../config.js";

export function getPayment() {
  let pesan =
    `💳 *METODE PEMBAYARAN*\n` +
    `─────────────────────────────\n\n`;

  for (const kategori of PAYMENT) {
    pesan += `${kategori.kategori}\n`;

    for (const m of kategori.metode) {
      pesan +=
        `  • *${m.nama}*\n` +
        `    No / ID : \`${m.norek}\`\n` +
        `    Atas Nama: ${m.an}\n`;
    }

    pesan += `\n`;
  }

  pesan +=
    `─────────────────────────────\n` +
    `📌 *Petunjuk Pembayaran:*\n` +
    `1. Transfer sesuai total harga\n` +
    `2. Screenshot / foto bukti bayar\n` +
    `3. Kirim bukti ke admin beserta ID MLBB\n` +
    `4. Tunggu konfirmasi — proses 1–15 menit ✅\n\n` +
    `_Jangan transfer ke rekening selain di atas._`;

  return pesan;
}