# Laporan Login Modal — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.

## Perubahan

- Tombol **Masuk** di navbar publik kini memakai `<button data-buka-login>`
  dan **tidak lagi mengarah ke `login.html`**.
- Modal login centered ditambahkan ke 4 halaman publik (index, memilah, harga, kontak):
  overlay gelap + blur, panel 460 px, radius elegan, shadow halus, animasi fade + scale.
- Isi modal: logo, judul "Selamat Datang Kembali", deskripsi singkat, input
  Username/Email, Password + show/hide, tombol Masuk, dan tombol X.
- `login.html` **dipertahankan** sebagai fallback untuk direct URL, tanpa sistem
  autentikasi kedua — modal dan halaman memakai `BankAuth.masuk()` yang sama.
- Skrip `js/login-modal.js` ditambahkan (satu kali per halaman, setelah markup modal).
- `js/auth.js` disesuaikan agar tombol Masuk berubah menjadi pill profil saat sesi ada.
- CSS modal ditambahkan di `css/style.css`, mengikuti token light/dark mode.

## Hasil pengujian

| No | Pengujian | Hasil |
| --- | --- | --- |
| 1 | Klik tombol Masuk | Modal muncul, URL tetap `/index.html`, tanpa reload |
| 2 | Posisi modal | Tengah tepat (640,450 pada 1280×900) |
| 3 | Klik tombol X | Modal tertutup, scroll background kembali |
| 4 | Klik overlay | Modal tertutup |
| 5 | Tekan Escape | Modal tertutup |
| 6 | Klik di dalam modal | Modal tetap terbuka |
| 7 | Show/Hide Password | `password → text`, aria-label berubah |
| 8 | Login valid | Error kosong, redirect ke `dashboard.html`, sesi tersimpan |
| 9 | Login tidak valid | Pesan "Username atau kata sandi salah." muncul di modal |
| 10 | Loading state | Tombol disabled, teks "Memproses...", spinner tampil |
| 11 | Focus management | Fokus awal di input username, kembali ke tombol pemicu saat tutup |
| 12 | Light/Dark mode | Panel putih / `#1C3028`, teks `#14201A` / `#F1F5F0` |
| 13 | Responsif | 1280: 445 px; 768: 460 px; 390: 374 px; 360: 344 px — semua **0 overflow** |
| 14 | Area sentuh | Input ≥51 px, tombol Masuk 43–44 px |

Console: **0 JavaScript error**, jaringan: **0 permintaan gagal**.

## File yang berubah

- `index.html`, `memilah.html`, `harga.html`, `kontak.html`
- `js/login-modal.js` (baru), `js/auth.js`
- `css/style.css`
- `docs/tangkapan-layout/login-modal-light.png`, `login-modal-dark.png`

## Catatan

- Jika pengguna sudah login, tombol di navbar menampilkan "Halo, Nama" dan
  mengarah ke dashboard; mengkliknya tidak membuka modal.
- Tetap berlaku keterbatasan sistem autentikasi demo berbasis `localStorage`
  sebagaimana dicatat di `docs/laporan-struktur-akses.md`.
