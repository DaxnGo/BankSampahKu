# Panduan Kontribusi

## Branch

- `main` berisi hasil stabil yang sudah ditinjau.
- Gunakan satu isu untuk satu branch dan satu pull request.
- Gunakan awalan branch `feat/`, `fix/`, `docs/`, atau `style/`, misalnya `feat/beranda`.
- Mulai dari `main` terbaru. Jangan mengubah riwayat branch bersama atau melakukan force push.

## Commit

Gunakan format `tipe(area): deskripsi singkat`, misalnya `feat(harga): tambah tabel harga sampah`. Tipe yang disarankan: `feat`, `fix`, `style`, `docs`, `chore`, dan `test`.

## Alur kerja harian dan pull request

1. Tarik perubahan terbaru dari `main`.
2. Pilih isu yang belum dikerjakan dan buat branch sesuai jenis perubahan.
3. Kerjakan perubahan dan buat commit kecil yang jelas.
4. Push branch ke GitHub.
5. Buka pull request yang menautkan isu.
6. Minta review silang sesuai urutan di bawah, lalu perbaiki catatan review.
7. Setelah disetujui, squash merge pull request.
8. Hapus branch setelah merge.

Urutan review silang:

- PR Anggota 1 direview Anggota 2.
- PR Anggota 2 direview Anggota 3.
- PR Anggota 3 direview Anggota 1.

## Kepemilikan file

- Anggota 1: `index.html`, `README.md`, `CONTRIBUTING.md`, `.github/`, dan bagian dasar `css/style.css`.
- Anggota 2: `memilah.html`, `harga.html`, `js/script.js`, dan bagian CSS halaman memilah, harga, serta mode gelap.
- Anggota 3: `kontak.html`, `js/kontak.js`, `img/`, `docs/`, dan bagian CSS kontak serta galeri.
- Perubahan pada bagian CSS atau file milik anggota lain perlu dibahas dengan pemilik file dan ditinjau melalui pull request.

## Menyelesaikan konflik merge

1. Tarik perubahan terbaru dari `main`.
2. Merge `main` ke branch kerja; jangan rebase branch bersama.
3. Buka file yang konflik dan tentukan versi yang benar bersama pemilik file.
4. Hapus penanda konflik Git setelah isi final dipilih.
5. Periksa ulang bagian sekitar perubahan dan jalankan pemeriksaan yang relevan.
6. Commit penyelesaian konflik dan push branch.
7. Minta peninjau memeriksa ulang pull request.

## Definisi Selesai

- HTML valid dan menggunakan elemen semantik.
- Tidak ada atribut `style=""` di HTML.
- Tampilan diperiksa pada lebar 375, 768, dan 1280 px.
- Gambar memiliki teks alt, fokus keyboard terlihat, dan kontras teks cukup.
- Konten dan navigasi utama tetap berfungsi tanpa JavaScript.
- Tautan antarhalaman tidak rusak.
- Perubahan ditinjau setidaknya satu anggota lain.
