# Login dan dashboard demo

BankSampahKu menggunakan login simulasi berbasis JavaScript untuk membagi tampilan petugas dan warga. Gunakan akun demo dari menu **Gunakan Akun Demo** pada [halaman Masuk](../login.html).

| Peran | Username demo | Kata sandi demo | Halaman setelah masuk |
| --- | --- | --- | --- |
| Petugas | `petugas` | `petugas123` | [Dashboard petugas](../dashboard.html) |
| Warga (Siti Aminah) | `warga` | `warga123` | [Dashboard warga](../dasbor-saya.html) |

## Alur demo

1. Masuk sebagai petugas dan buka **Input Setoran**.
2. Pilih Siti Aminah, tanggal pada Oktober 2026, jenis **Plastik**, dan berat **2 kg**. Simpan setoran.
3. Buka **Ringkasan** untuk melihat tambahan 2 kg dan perkiraan nilai Rp5.000 di periode demo.
4. Keluar, kemudian masuk sebagai warga di browser dan alamat situs yang sama. Lihat tambahan saldo dan setoran di **Ringkasan**, **Riwayat Setoran**, dan **Buku Tabungan**.

Ringkasan menghitung setoran pada Oktober 2026. Setoran di luar periode tersebut tetap tercatat di riwayat warga. Buku Tabungan menyediakan filter periode dan menampilkan perkiraan saldo dari setoran. Penarikan saldo belum tersedia.

## Bagaimana data diproses

- [Form masuk](../js/login.js) membaca isian pengguna. [Autentikasi demo](../js/auth.js) mencocokkan akun, menyimpan sesi, dan memilih dashboard berdasarkan peran.
- [Input setoran](../js/setoran.js) memeriksa isian dan menyimpan tanggal, penabung, jenis, dan berat. [BankData](../js/data.js) menghitung perkiraan nilai dari berat dan harga contoh per kilogram.
- [Dashboard petugas](../js/dashboard.js) menampilkan ringkasan gabungan. [Dashboard warga](../js/dasbor-saya.js) menampilkan ringkasan berdasarkan ID penabung yang sedang masuk.

## Penyimpanan dan batasan

Akun, setoran, dan sesi demo tersimpan di `localStorage` pada profil browser dan alamat situs yang digunakan. Data lokal dapat dibaca atau diubah dari browser, sehingga login ini hanya cocok untuk simulasi. Gunakan profil browser terpisah untuk memulai dari data awal. Menghapus data situs juga mengembalikan data awal sekaligus menghapus setoran demo yang telah ditambahkan.
