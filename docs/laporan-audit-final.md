# Laporan Audit Final — BankSampahKu

Tanggal: 18 November 2026. Status: **selesai diverifikasi**.

## 1. Lingkup pemeriksaan

- **8 halaman HTML**: index, memilah, harga, kontak, login, dashboard, setoran, dasbor-saya.
- **9 lebar layar**: 1920, 1440, 1366, 1280, 1024, 768, 480, 390, 360 px — total **72 konfigurasi**.
- 1 stylesheet utama, 11 berkas JavaScript, 24 PNG, 10 WebP, 5 JPG asli, 6 WOFF2.
- Pengujian tambahan: console/network, interaksi navbar, dropdown, dark mode, hamburger,
  modal video, back-to-top, data dashboard, formulir kontak, dan lightbox galeri.

## 2. Masalah ditemukan dan hasil perbaikan

| # | Masalah | Status | Tindakan |
| --- | --- | --- | --- |
| 1 | Tombol panah dropdown akun hanya 28x28 px | FIXED | Diperbesar ke 44x44 px dan pill diberi ruang kanan |
| 2 | Tombol Hapus pada tabel setoran tinggi 31 px | FIXED | `min-height: 44px` ditambahkan |
| 3 | Halaman login punya 0 `aria-current` saat sesi aktif | FIXED | Penanda halaman dipertahankan di `auth.js` |
| 4 | CSS mati: `.hero-banner-img`, `.progress-gulir`, token tak terpakai | FIXED | Dihapus; sisa CSS seimbang, 1 `:root` |
| 5 | Formulir kontak memakai `alert()` | FIXED | Diganti pesan inline pada elemen error dan `#formSuccess` |
| 6 | Lightbox galeri tidak merespons Escape dan tidak mengembalikan fokus | FIXED | Ditambahkan Escape, peran dialog, dan fokus kembali |
| 7 | Teks lama "Video edukasi belum tersedia" masih tersisa | FIXED | Dihapus dari semua HTML/JS |
| 8 | Kolom pesan lingkungan di footer dan tombol statis Ke Atas | FIXED | Kolom dihapus; tombol mengambang muncul saat scroll >300 px |

Tidak ditemukan overflow horizontal, ID duplikat, heading melompat, tautan mati,
gambar tanpa alt, input tanpa label, atau tombol tanpa nama.

## 3. File yang berubah pada audit ini

- `css/style.css` — hapus CSS mati, perbaiki target sentuh.
- `js/auth.js` — jaga `aria-current` pada login.
- `js/kontak.js` — validasi inline + lightbox lebih baik.
- `js/video-modal.js` — hapus teks fallback lama.
- 8 file HTML — struktur navbar/footer, tombol mengambang, modal video, dan video YouTube.
- `docs/laporan-akhir.md`, `docs/tangkapan-gerbang-1/`, `docs/tangkapan-audit/`.

## 4. Responsive testing

Semua 8 halaman pada 9 lebar: **`scrollWidth` tidak melebihi viewport**.
Tidak ada elemen yang keluar dari container kecuali di dalam penggulir yang disengaja
(nav ponsel dan pembungkus tabel). Pemeriksaan visual: 1920, 1280, 1024, 768, 390 px,
serta mode gelap 1280 px. Kartu, grid, tabel, dan footer menyesuaikan tanpa tabrakan.

## 5. Functionality testing

- Navbar: menu aktif, dropdown profil, Keluar, dark mode, hamburger ponsel — **lulus**.
- Modal YouTube: judul asli, iframe `youtube-nocookie`, tanpa autoplay, iframe dihapus
  saat ditutup, Escape/overlay/X berfungsi, buka-tutup berulang tanpa galat — **lulus**.
- Back-to-top: tersembunyi di atas, muncul setelah scroll 300 px, kembali ke 0 — **lulus**.
- Dashboard: 34 `data-metric`, `getAggregates()` aktif, API lama utuh, angka cocok
  dengan dashboard warga — **lulus**.
- Formulir kontak: validasi kosong dan pesan sukses — **lulus**.
- Lightbox galeri: buka, Escape menutup — **lulus**.

## 6. Console dan aset

Console: **0 error, 0 warning relevan**. Jaringan: **0 permintaan gagal** untuk aset lokal.
Seluruh path aset lokal valid; tidak ada ikon berbentuk kotak; logo tampil di semua halaman.

## 7. Masalah yang masih perlu perhatian

- **NEEDS ATTENTION** — `ScrollTrigger.min.js` tetap dimuat meski animasi tidak lagi
  memakainya. Dipertahankan untuk menjaga kontrak urutan skrip.
- **NEEDS ATTENTION** — folder `vendor/tabler-icons/` masih ada tetapi tidak dipakai;
  belum dihapus menunggu konfirmasi.
- **NEEDS ATTENTION** — Kebijakan Privasi dan Syarat & Ketentuan sengaja berupa teks,
  bukan tautan, karena halaman tujuannya belum ada.
## Catatan Redesign Modal Video (tambahan)

Modal video kini memakai panel 920 px, tinggi maksimal 90vh, latar `#102D24`,
overlay hitam dengan backdrop blur, sudut 14 px, serta animasi fade-in dan scale-up.
Header menampilkan badge "VIDEO EDUKASI", judul ringkas "Sampahku, Tanggung Jawabku",
sumber "APix Media", dan tombol X. Video 16:9 penuh lebar dengan sudut 12 px.
Iframe YouTube memakai `controls=1`, `playsinline=1`, `rel=0`, dan IFrame API;
kontrol mundur/maju 10 detik serta kecepatan benar-benar terhubung ke pemutar.

Verifikasi: modal tepat di tengah pada 1440/768/390 px, `scrollInternal` = 0 di
ketiga ukuran, rasio video 1.78, fokus kembali ke tombol "Lihat Video", iframe
dihapus saat ditutup, dan tidak ada galat JS.

- **NEEDS ATTENTION** — Video YouTube memerlukan koneksi internet; ini disengaja sesuai
  sumber video yang diberikan.

## 8. NOT TESTED

- Putar penuh video YouTube di dalam headless Chrome (area iframe tampil hitam); akan
  berjalan di browser pengguna dengan akses YouTube.
- Uji pembaca layar penuh (NVDA/VoiceOver) dan gesture sentuh di perangkat fisik.

## 9. Rekomendasi berikutnya

1. Tambahkan halaman Kebijakan Privasi dan Syarat & Ketentuan bila diperlukan.
2. Hapus `ScrollTrigger.min.js` dan folder Tabler jika kontrak urutan skrip sudah tidak
   dipertahankan.
3. Uji aksesibilitas dengan pembaca layar dan perangkat sentuh sungguhan.
4. Pertimbangkan animasi tambahan bila diperlukan, tetap hormati `prefers-reduced-motion`.
