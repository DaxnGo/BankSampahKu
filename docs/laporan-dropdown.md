# Laporan Perbaikan Dropdown & Select — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.
Backup: `banksampahku-backup-dropdown-20261118-0923`.

## 1. Akar masalah

Pengukuran browser sebelum perbaikan menunjukkan:
- Dropdown terakhir berada tepat di tepi kanan `.alat-bar` (`jarakKanan = 0`).
- `.alat-bar` adalah flex container tanpa padding internal; item terakhir menempel ke batas.
- `select` masih memakai arrow native (`appearance: auto`) dengan `padding-right: 12px`.
- Tidak ada custom chevron, sehingga ruang kanan tidak disiapkan.

Bukan masalah `margin` atau `position` yang salah, melainkan konfigurasi container dan select itu sendiri.

## 2. Perbaikan diterapkan

| Item | Sebelum | Sesudah |
|---|---|---|
| Container filter | Tanpa padding internal | `padding-inline: 16px` desktop, `12px` mobile |
| Select | `appearance: auto`, padding `8px 12px` | `appearance: none`, padding `10px 40px 10px 14px` |
| Tinggi | 44 px | 46 px |
| Chevron | Native, tidak seragam | Satu chevron CSS `::after`, kanan 14 px, `pointer-events: none`, warna `currentColor` (ikuti tema) |
| Flex child | Bisa menyusut tidak terduga | `min-width: 0`, `.kolom-pilih { flex: 0 0 auto }`, `.kolom-cari { flex: 1 1 260px }` |
| Mobile | Dua select mepet | Wrap vertikal, padding 12 px, tanpa overflow |

Semua `select` di 13 halaman dibungkus `.select-wrap` secara konsisten, termasuk
filter Riwayat, Buku Tabungan, Harga Sampah, form Setoran, kalkulator Harga, dan
pemutar video. Tidak ada dependency baru.

## 3. Standar yang dicapai

- Tinggi 46 px (standar 44–48 px).
- Padding kiri 14 px (standar 12–16 px).
- Padding kanan 40 px (standar 38–42 px).
- Jarak antar dropdown 12 px (standar 10–14 px).
- Jarak dropdown terakhir ke tepi container 16 px desktop / 12 px mobile.
- Chevron 8×8 px dengan border 2 px, posisi kanan 14 px, vertikal terpusat.
- Radius 8 px, konsisten dengan input lain.
- `box-sizing: border-box`, `min-width: 0`, tanpa negative margin/overflow hidden.

## 4. Verifikasi

| Pengujian | Hasil |
|---|---|
| 6 halaman dengan select × 9 lebar (54 konfigurasi) | 0 masalah |
| Jarak kanan ≥12 px, tinggi 44–48 px, padding kanan ≥38 px | Lolos |
| `appearance: none`, chevron tampil, tidak ada dua panah | Lolos |
| 234 konfigurasi seluruh website (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error |
| Filter & sorting masih berfungsi | Lolos (cari Kertas → 1 baris; filter Plastik → 2 baris; urut harga → Logam teratas) |

Diuji pada 1920, 1440, 1366, 1280, 1024, 768, 480, 390, 360 px, light & dark mode.
Tidak ada horizontal overflow.

## 5. File berubah

- 13 file HTML — pembungkus `.select-wrap` pada semua `<select>`.
- `css/style.css` — aturan dropdown/select, padding filter bar, responsive.

## 6. NEEDS ATTENTION

- Select pada dialog video (`#vk-yt-kecepatan`, `#vk-kecepatan`) kini memakai chevron yang sama; keduanya tetap dalam keadaan disabled sampai IFrame API siap.

## 7. NOT TESTED

- Perangkat sentuh fisik dan pembaca layar nyata.

Tangkapan: `docs/tangkapan-layout/dropdown-riwayat.png`,
`dropdown-riwayat-mobile.png`, `dropdown-harga.png`.
