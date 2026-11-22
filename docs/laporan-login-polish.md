# Laporan Final UI/UX Polish — Halaman Login Penuh

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.
Backup: `banksampahku-backup-login-polish-20261118-1001`.

Bukan redesign total — hanya penyempurnaan alignment, spacing, proporsi, dan responsive.

## 1. Navbar

- Logo di kiri; **Kembali ke Beranda** di kanan; theme toggle di sebelah kanan tombol kembali.
- Teks "Masuk" yang terlihat dihapus. Penanda halaman tetap ada sebagai teks `sr-only`
  dengan `aria-current="page"` (tidak mengganggu visual, tetap tersedia bagi pembaca layar).
- Akar masalah alignment ditemukan: `.header-inner` tidak memiliki `justify-content`.
  Kini memakai `justify-content: space-between`; kanan navbar sejajar dengan tepi container
  (terukur 1213 px pada viewport 1280, container max 1180 px).

## 2. Kartu & form

- Lebar 460 px, padding 24 px, radius 16 px, shadow lembut — dipertahankan.
- Input tinggi 44–45 px; tombol show/hide 44×44 px dengan ikon mata 20 px,
  terpusat secara vertikal, tidak mendominasi.
- Spacing vertikal form dan field diseragamkan.

## 3. Demo account

- Accordion **"Gunakan Akun Demo"** tetap tertutup secara default.
- Kartu Petugas dan Warga berdampingan, ukuran seragam, autofill tetap bekerja.
- Akun warga lain kini berupa **chip klik** (`budi`, `rina`, `andi`), bukan teks biasa;
  klik chip mengisi username/password dengan benar (teruji `rina / warga123`).
- Chevron berotasi halus 150 ms; ekspansi 200 ms tanpa layout shift terlihat.

## 4. Vertical layout

`main` memakai `min-height: calc(100vh - 88px)` dengan fallback `100svh`, flex center.

| Resolusi | Demo tertutup | Demo terbuka | CardBottom | Scroll |
|---|---:|---:|---:|---|
| 1920×1080 | 446 px | 622 px | 895 | tidak ada |
| 1440×900 | 446 px | 622 px | 805 | tidak ada |
| 1366×768 | 446 px | 622 px | 739 | tidak ada |
| 1280×720 | 446 px | 622 px | 718 | ~6 px, kartu tetap penuh terlihat |
| 390×844 | 438 px | 614 px | 811 | diperbolehkan |

Tidak ada horizontal overflow di semua ukuran.

## 5. Verifikasi fungsi

| Pengujian | Hasil |
|---|---|
| Demo tertutup default | Lolos |
| Buka/tutup accordion | Lolos |
| Autofill Petugas & Warga | Lolos |
| Autofill chip warga lain | Lolos |
| Show/Hide password | Lolos |
| Login invalid → pesan error | Lolos |
| Login valid → `dasbor-saya.html`, sesi tersimpan | Lolos |
| Theme toggle | Lolos |
| Navbar alignment | Lolos, tidak ada teks "Masuk" |
| 234 konfigurasi (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error |

## 6. File berubah

- `login.html` — navbar, chip demo, sr-only indicator.
- `js/login.js` — binding chip demo.
- `css/style.css` — justify-content header, ukuran input/mata, chip, min-height svh.

## 7. NEEDS ATTENTION

- Pada 1280×720 dengan demo terbuka terdapat ~6 px scroll tambahan; kartu tetap sepenuhnya
  terlihat dan scrolling alami diperbolehkan untuk viewport pendek.

## 8. NOT TESTED

- Perangkat sentuh fisik dan pembaca layar nyata.

Tangkapan: `docs/tangkapan-layout/login-polish-tutup.png`, `login-polish-buka.png`.
