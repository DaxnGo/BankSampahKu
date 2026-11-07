# Panduan Kontribusi

## Branch

- `main` berisi hasil stabil yang sudah ditinjau.
- Gunakan satu isu untuk satu branch dan satu pull request.
- Format branch: `feat/<nama>`, `fix/<nama>`, `docs/<nama>`, atau `style/<nama>`.
- Mulai dari `main` terbaru. Jangan mengubah riwayat branch bersama atau melakukan force push.

## Commit

Gunakan format `tipe(area): deskripsi singkat`, misalnya `feat(harga): tambah tabel harga sampah`. Tipe yang disarankan: `feat`, `fix`, `style`, `docs`, `chore`, dan `test`.

## Alur pull request

1. Pilih isu yang belum dikerjakan.
2. Tarik perubahan terbaru dari `main`.
3. Buat branch untuk isu tersebut.
4. Kerjakan perubahan dan buat commit kecil yang jelas.
5. Push branch dan buka pull request yang menautkan isu.
6. Minta satu anggota lain untuk meninjau.
7. Perbaiki catatan review, lalu squash merge setelah disetujui.
8. Hapus branch setelah merge.

Review silang berputar: Anggota 1 meninjau Anggota 2, Anggota 2 meninjau Anggota 3, dan Anggota 3 meninjau Anggota 1. Pemetaan nama dilakukan setelah anggota tim menyepakatinya.

## Kepemilikan file

- Anggota 1: `index.html`, `README.md`, `.github/`, dan bagian dasar `css/style.css`.
- Anggota 2: `memilah.html`, `harga.html`, dan `js/script.js`.
- Anggota 3: `kontak.html`, `img/`, dan `docs/`.
- Anggota 2 dan 3 menambahkan CSS hanya di bagian halaman masing-masing dalam `css/style.css`, memakai komentar penanda.
- Perubahan pada bagian dasar CSS atau file milik anggota lain perlu isu dan pull request, lalu ditinjau pemilik file.

## Menyelesaikan konflik merge

1. Perbarui branch kerja dari `main` terbaru.
2. Buka file yang konflik dan tentukan versi yang benar bersama pemilik file.
3. Hapus penanda konflik Git setelah isi final dipilih.
4. Periksa ulang bagian sekitar perubahan dan jalankan pemeriksaan yang relevan.
5. Commit penyelesaian konflik dan push branch.
6. Minta peninjau memeriksa ulang pull request.

## Definisi Selesai

- HTML valid dan menggunakan elemen semantik.
- Tidak ada atribut `style=""` di HTML.
- Tampilan diperiksa pada lebar 375, 768, dan 1280 px.
- Gambar memiliki teks alt, fokus keyboard terlihat, dan kontras teks cukup.
- Konten dan navigasi utama tetap berfungsi tanpa JavaScript.
- Tautan antarhalaman tidak rusak.
- Perubahan ditinjau setidaknya satu anggota lain.
