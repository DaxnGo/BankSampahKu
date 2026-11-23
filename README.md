# BankSampahKu

BankSampahKu adalah website edukasi bank sampah untuk membantu warga mengenal cara memilah sampah dan layanan bank sampah. Proyek ini dibuat untuk tugas kuliah Desain Web.

## Tujuan

Website ini menyajikan informasi dasar tentang pemilahan sampah, harga sampah, dan cara menghubungi bank sampah dalam satu tempat yang mudah dibuka melalui komputer maupun ponsel.

## Demo

[Demo GitHub Pages](https://daxngo.github.io/BankSampahKu/). Untuk meninjau perubahan lokal sebelum publikasi, gunakan langkah di bawah.

## Halaman dan fitur

### Fitur wajib (HTML dan CSS)

- **Beranda** (`index.html`): pengenalan singkat BankSampahKu.
- **Cara Memilah** (`memilah.html`): panduan pemilahan sampah.
- **Harga Sampah** (`harga.html`): informasi harga sampah.
- **Dashboard petugas** (`dashboard.html`) dan **Input Setoran** (`setoran.html`): ringkasan bank sampah, grafik, dan pencatatan setoran demo.
- **Dashboard warga** (`dasbor-saya.html`): perkiraan saldo, statistik pribadi, riwayat setoran, dan buku tabungan.
- **Kontak** (`kontak.html`): informasi kontak contoh, galeri, dan formulir simulasi. Pesan tidak dikirim.
- Navigasi antarhalaman dan konten utama tetap tersedia tanpa JavaScript.

### Fitur bonus (JavaScript)

- Kalkulator perkiraan saldo dari sampah yang disetorkan.
- Mode gelap.
- Validasi formulir kontak.
- Animasi masuk dan animasi gulir dengan GSAP + ScrollTrigger.
- Fitur bonus tidak menjadi syarat agar informasi utama website dapat dibaca.

## Teknologi

- HTML untuk struktur halaman.
- CSS custom untuk tampilan dan tata letak responsif, dengan Grid dan Flexbox.
- JavaScript vanilla untuk kalkulator, login demo, pencatatan setoran, serta statistik dan grafik SVG.
- Animasi memakai **GSAP 3.15.1** dan plugin **ScrollTrigger**, disimpan lokal di `vendor/gsap/` dan dijalankan oleh `js/animasi.js`. Elemen muncul ulang tiap kali masuk layar, baik saat digulir naik maupun turun. Animasi dilewati bila JavaScript mati atau pengguna mengaktifkan "kurangi gerak" (`prefers-reduced-motion`), sehingga konten tetap terbaca.
- Ikon antarmuka memakai SVG. Favicon ada di `assets/favicon.svg`.

## Struktur folder

```text
/
├── index.html
├── memilah.html
├── harga.html
├── dashboard.html
├── kontak.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   ├── kontak.js
│   └── animasi.js
├── img/
│   └── .gitkeep
├── vendor/
│   ├── tabler-icons/
│   │   ├── tabler-icons.min.css
│   │   ├── LICENSE
│   │   └── fonts/
│   └── gsap/
│       ├── gsap.min.js
│       ├── ScrollTrigger.min.js
│       └── LISENSI.md
├── docs/
│   ├── catatan-hasil-uji.md
│   ├── rancangan-laporan.md
│   └── rencana-github.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug.yml
    │   ├── dokumentasi.yml
    │   └── fitur.yml
    └── PULL_REQUEST_TEMPLATE.md
```

Folder `docs/` dimiliki Anggota 3. Tiga berkas awal di dalamnya adalah draf yang disiapkan Anggota 1.

## Menjalankan di komputer

1. Buka terminal di folder proyek, lalu jalankan `python -m http.server 8002` jika Python tersedia.
2. Buka [Beranda lokal](http://127.0.0.1:8002/), lalu pilih **Masuk → Akun Demo** untuk melihat akun petugas dan warga.
3. Untuk demo setoran yang mengubah ringkasan kedua dashboard, pilih akun warga **Siti Aminah** dan tanggal pada **Oktober 2026**. Setoran di luar periode tetap tersedia dalam riwayat.

Sesi, transaksi, dan tema tersimpan di `localStorage` browser pada alamat yang sama. Login demo berjalan di sisi browser dan hanya cocok untuk simulasi proyek. Video YouTube membutuhkan internet.

## Tim

Nama anggota belum diberikan, jadi placeholder nama dipertahankan.

| Anggota | Nama | GitHub | Tanggung jawab |
|---|---|---|---|
| Anggota 1 | [Nama] | [DaxnGo](https://github.com/DaxnGo) | Teknis dan repo |
| Anggota 2 | [Nama] | [RexFury4K](https://github.com/RexFury4K) | Konten dan fitur |
| Anggota 3 | [Nama] | [ZixxyProject](https://github.com/ZixxyProject) | Kontak, visual, dan dokumentasi |

## Kepemilikan file

| File atau bagian | Pemilik |
|---|---|
| `index.html`, `README.md`, `CONTRIBUTING.md`, `.github/`, `.gitignore`, `.editorconfig` | Anggota 1 |
| Bagian 1 (BASE) di `css/style.css` | Anggota 1 |
| `memilah.html`, `harga.html`, `js/script.js` | Anggota 2 |
| Bagian 2 (Memilah), 3 (Harga), dan 5 (Mode Gelap) di `css/style.css` | Anggota 2 |
| `kontak.html`, `js/kontak.js`, `img/`, `docs/` | Anggota 3 |
| Bagian 4 (Kontak) dan 6 (Galeri) di `css/style.css` | Anggota 3 |

Harga, alamat, nomor telepon, dan jam buka adalah data contoh. Angka di dashboard dihitung dari setoran demo, termasuk setoran yang ditambahkan di browser. Cantumkan sumber dan izin penggunaan aset di folder `docs/`.

## Kontribusi

Pilih isu, buat branch, kerjakan perubahan, lalu ajukan pull request untuk ditinjau anggota lain.

## Lisensi

Lisensi proyek belum ditentukan. Berkas lisensi akan ditambahkan setelah tim memilih lisensi yang sesuai.
