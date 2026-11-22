# Laporan Final Quality Assurance — BankSampahKu

Tanggal: 18 November 2026. Status: **FINAL QA SELESAI**.
Backup sebelum perubahan: `banksampahku-backup-qa-final-20261118-0804`.

## Ringkasan status

| Area | Status |
|---|---|
| UI/UX & Visual Consistency | FIXED & VERIFIED |
| Navigation & Routing | FIXED & VERIFIED |
| Interactive Elements | FIXED & VERIFIED |
| Icons & SVG | FIXED & VERIFIED |
| Authentication & Session | FIXED & VERIFIED |
| Dashboard & Data Consistency | FIXED & VERIFIED |
| Light Mode | FIXED & VERIFIED |
| Dark Mode | FIXED & VERIFIED |
| Responsive & Overflow | FIXED & VERIFIED |
| Accessibility | FIXED & VERIFIED |
| Performance & Code Quality | FIXED & VERIFIED |

## 1. Halaman diuji

13 halaman: Beranda, Cara Memilah, Harga Sampah (publik), Kontak, Login Penuh,
Dashboard Petugas, Input Setoran, Dashboard Warga, Riwayat Setoran, Buku Tabungan,
Harga Sampah (dashboard), Profil, Pengaturan. Modal login, modal video, dialog logout,
dan dialog detail transaksi termasuk dalam pengujian.

Tidak ada halaman duplikat; seluruh menu sidebar mengarah ke halaman yang benar-benar ada.

## 2. Masalah ditemukan & diperbaiki

| Masalah | Status | Perbaikan |
|---|---|---|
| `aria-current` ganda di dashboard saat sesi aktif (sidebar + dropdown profil) | FIXED & VERIFIED | Penanda dropdown dihapus; sidebar tetap satu-satunya penanda |
| Filter/input pada Riwayat, Buku Tabungan, Harga Sampah memiliki nama aksesibel yang terduga kosong | FIXED & VERIFIED | Audit awal false positive (label membungkus input). Ditambahkan `aria-label` eksplisit pada 7 kontrol agar nama bersih |
| Gambar `Edukasi-Sampah-1600.webp` dilaporkan gagal di Kontak 360/390 px | ALREADY WORKING | False positive lazy-load; setelah scroll dipaksa, ke-4 WebP termuat (`naturalWidth > 0`) |

Tidak ditemukan: broken link, empty href, ID duplikat, heading melompat, tombol tanpa nama, ikon rusak, atau aset gagal.

## 3. Pengujian browser nyata

- **234 konfigurasi** (13 halaman × 9 lebar × 2 tema): **0 masalah** — tidak ada overflow horizontal, `aria-current` tepat satu, H1 tepat satu, tidak ada elemen keluar viewport, tidak ada tombol tanpa nama, tidak ada input tanpa label.
- Latar konsisten: terang `rgb(244,246,240)` dan gelap `rgb(16,28,24)` di seluruh konfigurasi.
- Console/network: **0 error JavaScript**, 0 permintaan gagal.

### Responsif
1920, 1440, 1366, 1280, 1024, 768, 480, 390, 360 px — semua lolos tanpa horizontal scroll.

### Interaksi
| Fitur | Hasil |
|---|---|
| Login modal: buka, X, Escape, overlay, klik dalam modal | Lolos |
| Show/Hide password (modal & halaman penuh) | Lolos |
| Login valid → dashboard; login salah → error di modal | Lolos |
| Loading state saat login | Lolos |
| Logout: dialog konfirmasi, Batal, Keluar → sesi dihapus | Lolos |
| Akses langsung dashboard tanpa sesi | Ditolak → login dengan `?lanjut=` |
| Setelah logout, back-button dashboard | Ditolak → login |
| Dropdown profil | Lolos |
| Hamburger sidebar + Escape | Lolos |
| Search/filter riwayat & harga | Lolos |
| Detail transaksi + Escape | Lolos |
| Pagination | Tidak muncul karena data warga hanya 7 transaksi (perilaku benar) |
| Back-to-top | Lolos |
| Theme toggle + system preference | Lolos; pilihan manual tidak ditimpa sistem |
| Modal video: buka/tutup, iframe dihapus saat tutup, tanpa autoplay | Lolos |
| Kontrol video IFrame API (mundur/maju/kecepatan) | Lolos |
| Form kontak: validasi kosong & sukses | Lolos |
| Lightbox galeri + Escape | Lolos |
| Keyboard Tab: ring fokus 3 px terlihat | Lolos |
| `prefers-reduced-motion` aktif di CSS | Lolos |

## 4. Konsistensi data

- Ringkasan warga: saldo `Rp 140.250`, berat `67,5 kg`, 7 transaksi, progres 135% dengan bar visual dibatasi 100% dan status "Target tercapai".
- Buku Tabungan: saldo `Rp 140.250` (sama), kredit `Rp 140.250`, debit `Rp 0`.
- Riwayat: 7 transaksi dengan total nilai sama.
- Harga: 5 jenis dari objek `HARGA` yang sama dengan perhitungan setoran.
- Hak akses: petugas yang membuka halaman warga dialihkan ke `dashboard.html`; warga tidak melihat data petugas.

## 5. Kualitas kode

- CSS: satu `:root`, kurung seimbang, 88 token terdefinisi / 86 terpakai, tidak ada token undefined, tidak ada media query tidak tertutup.
- JS: 17 berkas lolos `node --check`.
- HTML: tidak ada tautan mati, empty href, atau heading skip.
- Tidak ada dependency baru, tidak ada git perubahan struktur.

## 6. File yang diubah pada QA ini

- `js/auth.js` — hapus duplikasi `aria-current` pada dropdown profil.
- `riwayat-setoran.html`, `buku-tabungan.html`, `harga-sampah.html` — `aria-label` eksplisit pada kontrol filter.

## 7. NEEDS ATTENTION

- Sistem autentikasi dan data masih berbasis `localStorage` demo (kata sandi tersimpan apa adanya di `js/data.js` di berkas data contoh). Proteksi role **client-side**; bukan autentikasi produksi.
- Tidak ada kedaluwarsa sesi karena tidak ada backend/session server.
- Fitur penarikan saldo belum ada, sehingga buku tabungan hanya berisi kredit.
- Footer sengaja disembunyikan pada halaman login desktop agar kartu masuk viewport; tetap tampil di mobile.

## 8. NOT TESTED

- Pembaca layar nyata (NVDA/VoiceOver) dan gesture perangkat sentuh fisik.
- Kedaluwarsa sesi dan validasi server-side (backend tidak tersedia).
- Putar penuh video YouTube di headless (area iframe tampil hitam); kontrol API teruji.

## 9. Rekomendasi lanjutan

1. Pindahkan autentikasi dan data ke backend dengan hash password, session `HttpOnly`, dan otorisasi server-side.
2. Tambahkan `expiry` sesi dan validasi peran di server.
3. Uji aksesibilitas dengan axe/Lighthouse dan pembaca layar nyata pada CI.
4. Tambahkan field `status` dan transaksi penarikan bila fitur tersebut dibutuhkan.

**Kesimpulan:** Seluruh fitur yang tersedia di project sudah berfungsi dan terverifikasi di browser. Website siap untuk demonstrasi dengan batasan yang telah dijelaskan di atas.
