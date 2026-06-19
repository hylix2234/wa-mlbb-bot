// ============================================================
//  KONFIGURASI BOT — sesuaikan sebelum jalankan
// ============================================================

export const CONFIG = {
  // Nama toko kamu
  NAMA_TOKO: "⚡ MLBB STORE ⚡",

  // Nama admin / owner
  NAMA_ADMIN: "0xasterix",

  // Nomor WA admin (format: 628xxxxxxxxxx — tanpa + dan spasi)
  NO_ADMIN: "6285723792958",

  // Prefix perintah
  PREFIX: ["!", "#", "."],

  // Pesan sambutan saat pertama kontak
  WELCOME: true,
};

// ============================================================
//  DAFTAR HARGA DIAMOND
// ============================================================
export const HARGA_DIAMOND = [
  { jumlah: "11 Diamond",   harga: 2_000 },
  { jumlah: "22 Diamond",   harga: 4_000 },
  { jumlah: "56 Diamond",   harga: 9_500 },
  { jumlah: "86 Diamond",   harga: 14_500 },
  { jumlah: "112 Diamond",  harga: 19_000 },
  { jumlah: "172 Diamond",  harga: 28_500 },
  { jumlah: "257 Diamond",  harga: 42_000 },
  { jumlah: "343 Diamond",  harga: 55_000 },
  { jumlah: "429 Diamond",  harga: 69_000 },
  { jumlah: "514 Diamond",  harga: 82_000 },
  { jumlah: "600 Diamond",  harga: 95_000 },
  { jumlah: "706 Diamond",  harga: 110_000 },
  { jumlah: "878 Diamond",  harga: 135_000 },
  { jumlah: "963 Diamond",  harga: 148_000 },
  { jumlah: "1_412 Diamond", harga: 215_000 },
  { jumlah: "2_195 Diamond", harga: 330_000 },
  { jumlah: "3_688 Diamond", harga: 550_000 },
  { jumlah: "5_532 Diamond", harga: 820_000 },
];

// ============================================================
//  DAFTAR HARGA WEEKLY DIAMOND PASS (WDP)
// ============================================================
export const HARGA_WDP = [
  { paket: "Weekly Diamond Pass x1", harga: 17_000 },
];

// ============================================================
//  DAFTAR HARGA STARLIGHT
// ============================================================
export const HARGA_STARLIGHT = [
  { paket: "Starlight Member",          harga: 30_000 },
  { paket: "Starlight Member Spesial",  harga: 50_000 },
  { paket: "Starlight Member + Badge",  harga: 55_000 },
];

// ============================================================
//  METODE PEMBAYARAN
// ============================================================
export const PAYMENT = [
  {
    kategori: "📱 E-Wallet",
    metode: [
      { nama: "Dana",    norek: "085723792958", an: "Haerul Anam" },
      { nama: "Seabank",    norek: "901974115634", an: "Haerul Anam" },
   ],
  },
];
