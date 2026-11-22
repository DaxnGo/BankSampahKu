# Laporan Klasifikasi & Integrasi Kategori Sampah — BankSampahKu

Tanggal: 18 November 2026. Status: **IMPLEMENTED & VERIFIED**.
Backup: `banksampahku-backup-kategori-20261118-0939`.

## 1. Struktur kategori baru

Fungsi baru `BankData.daftarKategori()` menjadi satu sumber klasifikasi:

| Kategori | Deskripsi | Contoh | Penanganan | Harga |
|---|---|---|---|---|
| Organik | Berasal dari makhluk hidup, mudah terurai | Sisa makanan, kulit buah/sayur, daun & ranting | Wadah tertutup → kompos | Tidak tersedia |
| Anorganik | Sulit terurai, banyak didaur ulang | Plastik, Kertas, Logam, Kaca | Kosongkan, bilas, keringkan, pisahkan per jenis | Tersedia (5 material) |
| B3 | Mengandung zat berbahaya | Baterai, lampu neon, kemasan pestisida/cat | Jangan dicampur; wadah tertutup; tanyakan tempat khusus | Tidak tersedia |

Teks edukasi disalin dari sumber yang sudah ada di `memilah.html`, bukan dikarang.

## 2. Perubahan data

- `daftarHarga()` kini menyertakan field `kategori: "Anorganik"` untuk kelima material.
- Harga lama tidak diubah: Plastik 2.500, Kertas 1.500, Kardus 2.000, Logam 5.000, Kaca 500.
- `daftarKategori()` diekspor tanpa mengubah API lama.
- Klasifikasi cocok dengan permintaan: Kaca, Kardus, Kertas, Logam, Plastik → Anorganik.

## 3. Halaman Harga Sampah Dashboard

- Filter kategori diisi otomatis dari `daftarKategori()`: Semua kategori, Organik, Anorganik, B3.
- Filter benar-benar menyaring data, bukan hanya mengubah label.
- Organik/B3 menampilkan 0 kartu harga dan pesan:
  **"Belum tersedia informasi harga setoran untuk kategori ini."**
- Jumlah hasil diperbarui otomatis (`role="status"`).
- Search, filter kategori, sorting A–Z / tertinggi / terendah tetap berfungsi.
- Bagian baru **"Klasifikasi Sampah"** menampilkan tiga kartu edukasi dengan ikon,
  deskripsi, contoh, penanganan, dan status harga.

## 4. Konsistensi antarhalaman

| Halaman | Status |
|---|---|
| Harga Sampah Dashboard | Filter 3 kategori + kartu edukasi |
| Cara Memilah | Sudah memuat ketiga kategori dengan deskripsi sesuai; dipertahankan |
| Form Input Setoran Petugas | Hanya material Anorganik berharga; sesuai data sistem, tidak ditambah pilihan dummy |
| Riwayat Setoran | Menampilkan `jenis` dari transaksi; tidak diubah |
| Harga Sampah Publik | Kalkulator memakai harga lama; tidak diubah |

## 5. Verifikasi browser

| Pengujian | Hasil |
|---|---|
| Opsi filter | Semua kategori, Organik, Anorganik, B3 |
| Semua kategori | 5 kartu, "5 jenis sampah ditemukan." |
| Organik | 0 kartu, pesan harga tidak tersedia tampil |
| Anorganik | 5 kartu, pesan tersembunyi |
| B3 | 0 kartu, pesan harga tidak tersedia tampil |
| Search "kaca" | 1 kartu |
| Sorting harga tertinggi | Logam teratas |
| 3 kartu klasifikasi | Organik, Anorganik, B3 |
| 234 konfigurasi (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error |

Tidak ada overflow horizontal; kartu edukasi responsif 3/2/1 kolom.

## 6. File berubah

- `js/data.js` — `daftarKategori()`, field kategori pada `daftarHarga()`.
- `js/harga-sampah.js` — filter, kartu edukasi, pesan tanpa harga.
- `harga-sampah.html` — bagian "Klasifikasi Sampah" dan catatan tanpa harga.
- `css/style.css` — gaya kartu kategori.

## 7. NEEDS ATTENTION

- Organik dan B3 sengaja tidak memiliki harga setoran karena data sistem belum menyediakannya.
- Form setoran petugas tidak menambahkan Organik/B3 agar tidak menciptakan transaksi tanpa harga.

## 8. NOT TESTED

- Pembaca layar dan perangkat sentuh fisik.

Tangkapan: `docs/tangkapan-layout/kategori-harga.png`, `kategori-harga-mobile.png`.
