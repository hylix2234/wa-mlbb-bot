export async function sendPayment(sock, jid) {
  await sock.sendMessage(jid, {
    image: { url: "https://raw.githubusercontent.com/hylix2234/wa-mlbb-bot/refs/heads/main/1000391568.jpg" },
    caption: 
      `💳 *METODE PEMBAYARAN*\n` +
      `─────────────────────────────\n\n` +
      `📱 E-Wallet\n` +
      `  • *Dana*\n` +
      `    No / ID : \`085723792958\`\n` +
      `    Atas Nama: Haerul Anam\n` +
      `  • *Seabank*\n` +
      `    No / ID : \`901974115634\`\n` +
      `    Atas Nama: Haerul Anam\n\n` +
      `🏦 *QRIS*\n` +
      `    Scan QR di atas\n` +
      `    (Dana, GoPay, OVO, ShopeePay, dll)\n\n` +
      `─────────────────────────────\n` +
      `📌 *Petunjuk Pembayaran:*\n` +
      `1. Transfer sesuai total harga\n` +
      `2. Screenshot / foto bukti bayar\n` +
      `3. Kirim bukti ke admin beserta ID MLBB\n` +
      `4. Tunggu konfirmasi — proses 1–15 menit ✅\n\n` +
      `_Jangan transfer ke rekening selain di atas._`
  });
}
