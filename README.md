# BankSampahKu

Website edukasi pemilahan sampah dan simulasi layanan bank sampah untuk tugas kuliah Desain Web. Pengembangan proyek telah selesai. Demo dan kode tersedia sebagai dokumentasi hasil akhir.

**[Buka demo BankSampahKu](https://daxngo.github.io/BankSampahKu/)**

## Fitur

- **Beranda dan Cara Memilah** menampilkan panduan, manfaat, serta video edukasi yang diputar dalam modal Beranda.
- **Harga Sampah** menyediakan harga contoh dan kalkulator perkiraan nilai setoran.
- **Petugas** dapat mencatat setoran demo dan melihat ringkasan, grafik, serta setoran terbaru.
- **Warga** dapat melihat ringkasan pribadi, riwayat setoran, dan buku tabungan.
- **Kontak** berisi informasi contoh, galeri, dan formulir simulasi yang tidak mengirim pesan.
- Pengguna dapat memilih tema terang atau gelap.

## Jalankan dan coba demo

1. Dari folder proyek jalankan `python -m http.server 8002 --bind 127.0.0.1`, lalu buka [Beranda lokal](http://127.0.0.1:8002/). Demo GitHub Pages juga dapat langsung digunakan.
2. Pilih **Masuk → Gunakan Akun Demo → Petugas**, lalu klik **Masuk**. Pada **Input Setoran**, pilih **Siti Aminah**, tanggal di **Oktober 2026**, dan misalnya **2 kg Plastik**.
3. Lihat perubahan pada **Ringkasan**, lalu keluar dan masuk sebagai **Warga** dari browser dan alamat yang sama. Cek saldo dan riwayat Siti. Contoh 2 kg plastik menambah perkiraan saldo Rp5.000.

| Peran | Username demo | Kata sandi demo |
| --- | --- | --- |
| Petugas | `petugas` | `petugas123` |
| Warga (Siti Aminah) | `warga` | `warga123` |

Ringkasan menggunakan periode demo **Oktober 2026**. Setoran di luar periode tetap tercatat di riwayat. Data setoran, sesi, dan tema tersimpan di `localStorage` untuk alamat situs dan profil browser yang digunakan. Penghapusan data situs akan mengembalikan demo ke data awal. Login berjalan di sisi browser dan hanya untuk simulasi. Harga, saldo, dan informasi kontak merupakan contoh. Pemutaran video YouTube membutuhkan internet.

## Kode dan dokumentasi

- Halaman publik dan dashboard berada di HTML pada direktori utama. [CSS](css/style.css) menggunakan CSS Grid, Flexbox, dan token tema untuk tata letak responsif.
- [JavaScript](js/) menangani login, data, formulir, kalkulator, serta grafik SVG. [GSAP dan ScrollTrigger](vendor/gsap/) disimpan lokal untuk animasi.
- [Aset](assets/) memuat font dan favicon. [Gambar](img/) memuat ilustrasi dan galeri.
- Baca [panduan login dan dashboard](docs/fitur-login-dashboard.md), [kredit dan lisensi aset pihak ketiga](docs/THIRD-PARTY.md), serta [panduan kontribusi](CONTRIBUTING.md) jika perlu melakukan pemeliharaan. Laporan dan rencana lain di [folder dokumentasi](docs/) merekam tahapan pengembangan.

## Tim

| GitHub | Tanggung jawab |
| --- | --- |
| [DaxnGo](https://github.com/DaxnGo) | Teknis dan repositori |
| [RexFury4K](https://github.com/RexFury4K) | Konten dan fitur |
| [ZixxyProject](https://github.com/ZixxyProject) | Kontak, visual, dan dokumentasi |

Lisensi proyek secara keseluruhan belum ditetapkan. Pustaka dan aset pihak ketiga mengikuti lisensinya masing-masing.
