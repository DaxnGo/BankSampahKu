# Laporan Pemisahan Public Website, Login, dan Private Dashboard

Tanggal: 18 November 2026. Status: **implementasi selesai & diverifikasi**.

## 1. Lingkup

8 halaman diperiksa: 5 publik (index, memilah, harga, kontak, login) dan
3 privat (dashboard, setoran, dasbor-saya). Pengujian mencakup alur lengkap,
72 konfigurasi responsif (4 layout × 9 lebar × 2 tema), dan regresi fitur lama.

## 2. Public Website — FIXED & VERIFIED

- Menu **Dashboard dihapus** dari navbar publik; tombol **Masuk** tetap ada.
- Navbar, hero, konten, dan footer publik tidak diubah selain penghapusan menu tersebut.
- Beranda, Cara Memilah, Harga Sampah, dan Kontak tetap can diakses tanpa login.
- Pengguna yang sudah login melihat pill profil "Halo, Nama" di navbar publik.

## 3. Login Page — FIXED & VERIFIED

- Judul **Selamat Datang Kembali**, deskripsi singkat, logo, dan layout dua kolom.
- Input **Username atau Email** dan **Password** dengan tombol show/hide yang
  mengubah `type` dan `aria-label` (terverifikasi: `password → text`).
- Validasi kosong, pesan error saat kredensial salah, dan **loading state**
  (`sedang-muat`, tombol disabled, teks "Memproses...").
- Memakai `BankAuth.masuk()` yang sudah ada — bukan autentikasi palsu.
- Akun contoh dan tombol reset data tetap berfungsi.

## 4. Private Dashboard — FIXED & VERIFIED

- Tiga halaman privat kini memakai **layout aplikasi terpisah**: sidebar,
  dashboard header, main content. Navbar/footer publik **tidak ada** di sini
  (terverifikasi: `main-nav = 0`).
- Sidebar berisi menu sesuai fitur yang benar-benar ada:
  - Petugas: Ringkasan, Input Setoran, Harga Sampah.
  - Warga: Ringkasan, Riwayat Setoran, Buku Tabungan, Harga Sampah.
- Indikator aktif di sidebar mengikuti halaman.
- Header menampilkan nama pengguna, peran, judul halaman, dropdown profil,
  theme toggle, dan tombol buka/tutup sidebar di mobile.
- **34 `data-metric`** di dashboard dan seluruh skrip lama tetap utuh.

## 5. Autentikasi & Route Protection — FIXED & VERIFIED

| Pengujian | Hasil |
| --- | --- |
| Buka dashboard tanpa sesi | DIALIHKAN ke `login.html?lanjut=dashboard.html` |
| Login salah | Tetap di login, pesan error muncul |
| Login benar (petugas) | Diarahkan ke `dashboard.html`, sesi tersimpan |
| Navigasi sidebar ke setoran | Berhasil tanpa logout, item aktif berubah |
| Buka halaman publik saat login | Berhasil, navbar profil tampil |
| Logout (sidebar) | Dialog konfirmasi muncul |
| Klik Batal | Sesi tetap ada, tetap di dashboard |
| Klik Keluar | Sesi dihapus, diarahkan ke Beranda |
| Buka dashboard setelah logout | DIALIHKAN ke login (guard + `pageshow` untuk Back) |
| Refresh halaman privat | Sesi tetap terbaca, tema tetap tersimpan |

Guard juga ditambahkan di `<head>` halaman privat agar tidak ada kedipan
halaman privat sebelum redirect.

## 6. Logout Experience — FIXED & VERIFIED

Dialog native `<dialog>` dengan pesan persis
**"Apakah Anda yakin ingin keluar dari akun?"**, tombol **Batal** dan **Keluar**.
Tombol Keluar tersedia baik di sidebar maupun dropdown profil publik.

## 7. Responsive & Tema — FIXED & VERIFIED

- 72 konfigurasi (login, dashboard, setoran, dasbor-saya × 9 lebar × 2 tema):
  **0 overflow horizontal**, 0 elemen kunci hilang.
- Mobile 390 px: sidebar tertutup (`translateX(-280px)`), tombol toggle membuka,
  Escape menutup, `aria-expanded` sinkron.
- Theme toggle di dashboard mengubah tema, tersimpan di localStorage, dan
  bertahan setelah reload.

## 8. File yang diubah

- 8 file HTML (navbar publik, shell dashboard, login, dialog logout).
- `css/style.css` — layout dashboard, login, dialog logout.
- `js/auth.js` — guard, sidebar, dialog logout, pageshow.
- `js/login.js` — validasi, show/hide, loading state.

## 9. Catatan penting

- **NEEDS ATTENTION** — Sistem autentikasi proyek adalah **demo berbasis
  localStorage** dengan kata sandi tersimpan apa adanya di `js/data.js`.
  Ini **TIDAK aman** untuk produksi. Proteksi halaman bersifat client-side;
  pengguna dengan pengetahuan teknis dapat memanipulasi localStorage.
  Belum ada backend/token/server-side session yang dapat dipakai.
- **NEEDS ATTENTION** — Halaman "Profil" dan "Pengaturan" tidak dibuat karena
  belum ada fitur/halamannya; tidak ada menu dummy.
- **NOT TESTED** — Uji pembaca layar dan perangkat sentuh fisik.

## 10. Rekomendasi

1. Pindahkan autentikasi ke server dengan hash password (bcrypt/argon2),
   cookie `HttpOnly` + `Secure`, dan validasi sesi di server.
2. Tambahkan halaman Profil/Pengaturan bila fitur tersebut tersedia.
3. Uji aksesibilitas dashboard dengan NVDA/VoiceOver dan perangkat mobile nyata.
