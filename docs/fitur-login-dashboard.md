# Fitur demo: login dan dashboard dinamis

Dokumen ini menjelaskan fitur yang ditambahkan pada cabang `fitur/login-dashboard`.

## Tujuan

Website BankSampahKu sebelumnya berupa web edukasi statis. `dashboard.html` sudah ada, tetapi seluruh angkanya masih data contoh yang ditulis langsung di HTML. Fitur ini menambahkan:

1. Halaman masuk dengan dua peran: petugas dan warga.
2. Form pencatatan setoran oleh petugas.
3. Dashboard yang dihitung ulang dari data setoran.
4. Dashboard pribadi untuk warga.

## Akun contoh

| Peran | Username | Kata sandi | Halaman setelah masuk |
|---|---|---|---|
| Petugas | `petugas` | `petugas123` | `dashboard.html` |
| Warga | `warga` | `warga123` | `dasbor-saya.html` |
| Warga | `budi`, `rina`, `andi` | `warga123` | `dasbor-saya.html` |

Tombol akun contoh di halaman `login.html` dapat mengisi formulir otomatis.

## Alur singkat

1. Buka `login.html` dan masuk sebagai petugas.
2. Buka `Input Setoran` di navigasi, lalu catat transaksi.
3. Buka `dashboard.html` — angka ringkasan, per jenis, peringkat RT, dan setoran terbaru berubah.
4. Masuk sebagai warga untuk melihat saldo dan riwayat milik sendiri.
5. Tombol `Keluar` di navigasi mengakhiri sesi. Halaman petugas dan warga menolak akses tanpa sesi yang sesuai.

Periode data contoh adalah **Oktober 2026**, mengikuti konten dashboard yang sudah ada.

## File yang ditambahkan

| File | Fungsi |
|---|---|
| `js/data.js` | Data awal, penyimpanan `localStorage`, dan fungsi perhitungan ringkasan |
| `js/auth.js` | Sesi login, pengaman halaman, penyesuaian navigasi |
| `js/login.js` | Logika formulir masuk dan tombol akun contoh |
| `js/setoran.js` | Form input setoran dan daftar transaksi |
| `js/dashboard.js` | Mengisi penanda `data-metric` di dashboard lama |
| `js/dasbor-saya.js` | Menampilkan dashboard pribadi warga |
| `login.html`, `setoran.html`, `dasbor-saya.html` | Halaman baru |

`css/style.css` mendapat bagian ke-9 untuk gaya halaman tersebut. Halaman lama hanya ditambah tautan `Masuk` dan dua skrip (`data.js`, `auth.js`).

## Mengulang data

Tombol **Kembalikan data contoh awal** di `login.html` mengembalikan seluruh akun dan setoran ke kondisi awal, sekaligus mengakhiri sesi.

## Catatan penting

Ini adalah **simulasi untuk tugas**, bukan autentikasi yang aman:

- Kata sandi disimpan apa adanya di `localStorage`.
- Data hanya tersimpan di browser perangkat yang dipakai, tidak tersinkron antarperangkat.
- Siapa pun yang membuka browser yang sama dapat membaca atau mengubah data.

Untuk penggunaan sungguhan, diperlukan backend dengan layanan autentikasi yang sesuai, misalnya Supabase atau Firebase, dengan kata sandi yang di-hash dan aturan akses di server.
