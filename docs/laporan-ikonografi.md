# Laporan Audit & Perbaikan Ikonografi + Login Compact — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.

## 1. Jumlah ikon diperiksa

- **292 inline SVG** di 13 halaman HTML.
- 0 file SVG terpisah di `assets/`; 0 ikon font; 0 emoji/Unicode sebagai ikon UI.
- 268 SVG memakai `currentColor`; 23 SVG berwarna hardcoded semuanya adalah **logo BankSampahKu** dan sengaja dipertahankan.
- 292/292 memiliki `viewBox`; tidak ada SVG broken/clipped.

## 2. Masalah ditemukan & diperbaiki

| Masalah | Status | Perbaikan |
|---|---|---|
| Sidebar "Ringkasan" memakai ikon grafik batang, kurang spesifik | FIXED & VERIFIED | Diganti ikon **LayoutDashboard** (4 kotak) di 8 halaman dashboard |
| Sidebar "Riwayat Setoran" memakai ikon dokumen | FIXED & VERIFIED | Diganti ikon **History** (jam + panah) di 6 halaman |
| Kategori "Organik" memakai ikon apel | FIXED & VERIFIED | Diganti ikon **daun** yang sudah ada di project |
| Harga "Logam" memakai ikon petir (energi) | FIXED & VERIFIED | Diganti ikon **kaleng** stroke-based buatan sendiri |
| Ukuran ikon tidak konsisten (13–18 px, kartu 36–58 px) | FIXED & VERIFIED | Token baru: `--ikon-sidebar:20px`, `--ikon-tombol:17px`, `--ikon-stat:28px` |
| Ikon show/hide password bertumpuk | FIXED & VERIFIED | `.hidden` pada SVG diganti `setAttribute/removeAttribute` + CSS `[hidden]` |
| Ikon fill hardcoded di luar logo | FIXED & VERIFIED | Tidak ditemukan |

## 3. Konsistensi ukuran (terukur di browser)

| Konteks | Sebelum | Sesudah |
|---|---|---|
| Sidebar dashboard | 17–18 px | **20 px** |
| Tombol/nav publik | 16–17 px | **17 px** |
| Kartu statistik Beranda | 52–58 px | **28 px** |
| Ikon kartu Memilah | 36 px | **28 px** |
| Indikator kecil | 13–15 px | dipertahankan |

Tidak ada ikon berukuran 0 atau terpotong.

## 4. Library & aset

- Satu gaya: **inline SVG stroke-based**, `viewBox 0 0 24 24`, `stroke-width: 2`, `stroke-linecap/linejoin: round`.
- Tidak ada dependency baru, tidak ada SVG dari internet, tidak ada rasterisasi ikon.
- Logo BankSampahKu dan ilustrasi daur ulang tetap memakai warna aslinya.

## 5. Light Mode & Dark Mode

- 16 konfigurasi kontras (8 halaman × 2 tema): **0 gagal** WCAG.
- 144 konfigurasi responsif dashboard (8 halaman × 9 lebar × 2 tema): **0 overflow**, 0 elemen hilang.
- Warna ikon mengikuti token: light `#145C46`/`#123D2D`, dark `#65B88A`/`#C0CEC4`. Tidak ada hijau neon.

## 6. Interaksi ikon (teruji)

| Interaksi | Hasil |
|---|---|
| Show/Hide password | Lolos — hanya satu ikon tampil per state |
| Theme toggle | Lolos — `terang → gelap` |
| Profile dropdown | Lolos — buka/tutup |
| Sidebar collapse mobile | Lolos — buka + Escape tutup |
| Search riwayat | Lolos — 7 → 1 baris |
| Detail transaksi | Lolos — dialog buka, Escape tutup |
| Logout dialog | Lolos — konfirmasi muncul |
| Modal video close | Lolos |
| Pagination | Tidak muncul karena data warga hanya 7 transaksi (perilaku benar) |

Console/network: **0 galat JS**, 0 aset gagal dimuat.

## 7. Login penuh compact (permintaan terkait)

Halaman `login.html` dipadatkan:
- Kartu 460 px, padding 16 px, judul lebih kecil, form gap 12 px, input 40 px.
- Akun demo dua kartu berdampingan; keterangan akun lain satu baris ringkas; reset data 36 px.
- Footer publik disembunyikan pada desktop halaman login.
- Deskripsi dipendekan jadi satu kalimat.

Terukur:
| Resolusi | scrollHeight | viewport | Vertical scroll |
|---|---:|---:|---|
| 1920×1080 | 1080 | 1080 | Tidak ada |
| 1366×768 | 768 | 768 | Tidak ada |
| 1280×720 | 720 | 720 | Tidak ada |
| 390×844 | 1453 | 844 | Ada (diizinkan) |

Fungsi login, demo account, validasi, error, redirect, session, dan theme toggle tetap lolos.

## 8. NEEDS ATTENTION

- Ikon info kartu Kontak berukuran 46 px (lebih besar dari standar 28 px), tetapi berfungsi sebagai ikon kartu kontak, bukan ikon UI; sengaja dipertahankan.
- Dua token lama `--utama` dan `--sekunder` masih tidak terpakai.

## 9. NOT TESTED

- Pembaca layar (NVDA/VoiceOver) dan gesture perangkat sentuh fisik.
- Pagination dengan data > 8 transaksi (belum tersedia di data demo).

## 10. File berubah

- HTML: 8 halaman dashboard + `memilah.html`, `harga.html`, `login.html`.
- CSS: `css/style.css` (token ikon, selector ukuran, compact login, SVG `[hidden]`).
- JS: `js/login-modal.js`, `js/login.js`, `js/video-modal.js`, `js/pengaturan.js`, `js/auth.js`.
- Dokumen: `docs/laporan-ikonografi.md` (ini), `docs/laporan-roadmap-desain.md`, `docs/DESIGN-TOKENS.md`.
