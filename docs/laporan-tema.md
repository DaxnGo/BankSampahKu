# Laporan Audit Light Mode & Dark Mode — BankSampahKu

Tanggal: 18 November 2026. Status: **selesai & terverifikasi**.

## 1. Lingkup

- **8 halaman HTML** diperiksa dalam dua tema.
- **144 konfigurasi responsif**: 8 halaman × 9 lebar (1920, 1440, 1366, 1280,
  1024, 768, 480, 390, 360 px) × 2 tema.
- **16 konfigurasi kontras**: 8 halaman × 2 tema, dengan 18 grup elemen
  (heading, body, nav, tombol, tabel, form, footer, badge, dll).
- Uji toggling: klik, refresh, pindah halaman, system preference, ikon, meta theme,
  serta tidak ada reload.

## 2. Light Mode

| Temuan | Status | Perbaikan |
| --- | --- | --- |
| Background utama `#F4F6F2` belum sesuai brief | FIXED & VERIFIED | `--kertas-50` → `#F4F6F0` |
| Soft green belum presisi | FIXED & VERIFIED | `--kertas-100` → `#E7EFE4` |
| Placeholder memakai warna browser | FIXED & VERIFIED | `::placeholder` memakai `--tinta-muda` |
| Teks pada badge kuning di dashboard | FIXED & VERIFIED | Memakai `--sorot-teks` agar kontras |

Light mode sekarang: latar off-white, kartu putih, aksen Forest Green, teks
Dark Text `#123D2D`, dan sage lembut — tanpa warna menyilaukan.

## 3. Dark Mode

| Temuan | Status | Perbaikan |
| --- | --- | --- |
| Palet lama terlalu hitam/abu dan tidak bertingkat | FIXED & VERIFIED | Palet baru: `#101C18`, `#162720`, `#1C3028`, `#243B31`, border `#354A40` |
| Teks utama/sekunder kurang sesuai brief | FIXED & VERIFIED | `#F1F5F0`, `#C0CEC4`, muted `#9BAFA2` |
| Aksen gelap kurang harmonis | FIXED & VERIFIED | Primary `#65B88A`, secondary `#8BCB70` |
| Token komponen (`--forest`, `--light-hijau`, `--nav-teks`) tidak ikut gelap | FIXED & VERIFIED | Ditimpa di `html[data-tema="gelap"]` |
| Menu aktif dan avatar memakai teks putih | FIXED & VERIFIED | Memakai `--di-atas-aksen` (gelap di dark mode) |
| Badge kuning memakai teks hijau | FIXED & VERIFIED | Memakai `--sorot-teks` |

Tidak ditemukan elemen yang masih memakai warna light saat dark mode aktif
(pemindaian 4 halaman: **0 elemen tertinggal**).

## 4. Kontras

Dari 16 konfigurasi kontras, **0 elemen gagal** terhadap ambang WCAG
(4.5:1 untuk teks normal, 3:1 untuk teks besar/UI). Yang diuji mencakup
heading, paragraf, navigasi, tombol, tabel, form, footer, dropdown, badge, dan teks monokrom angka.

## 5. Theme toggle

| Perilaku | Hasil |
| --- | --- |
| Klik mengubah tema tanpa reload | FIXED & VERIFIED |
| Ikon bulan/matahari berganti | FIXED & VERIFIED |
| `theme-color` meta mengikuti tema | FIXED & VERIFIED |
| Tersimpan di localStorage | FIXED & VERIFIED |
| Bertahan setelah refresh dan pindah halaman | FIXED & VERIFIED |
| System preference dipakai hanya bila belum ada pilihan manual | FIXED & VERIFIED |
| Tidak ada kedip saat memuat | FIXED & VERIFIED (inline init di `<head>`) |

## 6. File yang berubah

- `css/style.css` — palet light/dark, token komponen, placeholder, badge.
- `js/tema.js` — meta theme-color disamakan.
- 8 file HTML — inline inisialisasi tema di `<head>`.

## 7. Responsif & regresi

- 144 konfigurasi responsif dua tema: **0 overflow horizontal**, 0 elemen kunci
  tersembunyi, 0 teks terpotong pada elemen yang diperiksa.
- Console: **0 error**, jaringan: **0 permintaan gagal**.
- Login/logout, dashboard, modal video, dropdown, hamburger, dan back-to-top
  tetap berfungsi (regresi lolos).

## 8. Masalah yang belum terselesaikan

- **NEEDS ATTENTION** — Modal video dan footer sengaja memakai latar gelap di
  kedua tema sebagai elemen branded; ini bukan bug.
- **NEEDS ATTENTION** — Video YouTube memerlukan koneksi internet; di headless
  area iframe tampil hitam meskipun API dan kontrol termuat.
- **NEEDS ATTENTION** — Dua berkas `.codebuddy/*.md` memiliki satu karakter
  rusak sejak awal dan di luar lingkup website.
- **NOT TESTED** — Uji pembaca layar penuh dan Gestur perangkat sentuh fisik.

## 9. Rekomendasi

1. Uji kontras dengan axe/Lighthouse di lingkungan CI.
2. Uji aksesibilitas nyata dengan NVDA/VoiceOver dan perangkat mobile.
3. Jika diperlukan, ekspos token `--tinta-muda` ke komponen teks sekunder
  tambahan agar hierarki lebih seragam.
