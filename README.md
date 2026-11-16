# BankSampahKu

BankSampahKu adalah website edukasi bank sampah untuk membantu warga mengenal cara memilah sampah dan layanan bank sampah. Proyek ini dibuat untuk tugas kuliah Desain Web.

## Tujuan

Website ini menyajikan informasi dasar tentang pemilahan sampah, harga sampah, dan cara menghubungi bank sampah dalam satu tempat yang mudah dibuka melalui komputer maupun ponsel.

## Tangkapan layar

> **Tangkapan layar belum tersedia.** Setelah gambar ditambahkan ke `img/`, tampilkan dengan `![Tampilan Beranda BankSampahKu](img/screenshot-beranda.png)`.

## Demo

Demo GitHub Pages: belum tersedia. Tautan akan ditambahkan setelah file website diunggah dan GitHub Pages diaktifkan.

## Halaman dan fitur

### Fitur wajib (HTML dan CSS)

- **Beranda** (`index.html`): pengenalan singkat BankSampahKu.
- **Cara Memilah** (`memilah.html`): panduan pemilahan sampah.
- **Harga Sampah** (`harga.html`): informasi harga sampah.
- **Dashboard** (`dashboard.html`): ringkasan kinerja bank sampah (total sampah, jumlah penabung, saldo dibayarkan, target bulan ini, peringkat per RT, dan setoran terbaru). Versi awal ini masih statis dan **memakai data contoh**; belum terhubung ke data setoran nyata.
- **Kontak** (`kontak.html`): informasi kontak bank sampah.
- Navigasi antarhalaman dan konten utama tetap tersedia tanpa JavaScript.

### Fitur bonus (JavaScript)

- Kalkulator perkiraan saldo dari sampah yang disetorkan.
- Mode gelap.
- Validasi formulir kontak.
- Fitur bonus tidak menjadi syarat agar informasi utama website dapat dibaca.

## Teknologi

- HTML untuk struktur halaman.
- CSS untuk tampilan dan tata letak responsif.
- JavaScript untuk fitur bonus.
- Ikon dari **Tabler Icons 3.19.0** (webfont) yang disimpan lokal di `vendor/tabler-icons/`, dipakai dengan `<i class="ti ti-nama-ikon">`. Tidak memakai CDN sehingga tetap tampil saat offline. Lisensi MIT ada di `vendor/tabler-icons/LICENSE`. Ikon yang dipakai: `leaf`, `recycle`, `users`, `home`, `tag`, `phone`, `apple`, `bottle`, `battery`, `check`, `file-text`, `package`, `bolt`, `mail`, `map-pin`, dan `arrow-right`.

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
│   └── kontak.js
├── img/
│   └── .gitkeep
├── vendor/
│   └── tabler-icons/
│       ├── tabler-icons.min.css
│       ├── LICENSE
│       └── fonts/
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

1. Clone atau unduh repo.
2. Buka `index.html` menggunakan browser.
3. Website dapat dibuka sebagai halaman statis tanpa instalasi paket.

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

Harga sampah, alamat, nomor telepon, dan jam buka pada website adalah data contoh sampai diverifikasi oleh tim. Halaman dashboard juga masih memakai data contoh sepenuhnya dan belum terhubung ke data setoran nyata; angkanya ditandai dengan atribut `data-metric` agar nanti mudah diisi dari sumber data asli. Cantumkan sumber dan izin penggunaan setiap gambar atau aset di folder `docs/`.

## Kontribusi

Pilih isu, buat branch, kerjakan perubahan, lalu ajukan pull request untuk ditinjau anggota lain. Baca [CONTRIBUTING.md](CONTRIBUTING.md) sebelum mulai.

## Lisensi

Lisensi proyek belum ditentukan. Berkas lisensi akan ditambahkan setelah tim memilih lisensi yang sesuai.
