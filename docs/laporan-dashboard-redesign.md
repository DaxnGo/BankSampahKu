# Laporan Redesign Dashboard Nasabah & Petugas

Tanggal: 18 November 2026
Ruang lingkup: `dashboard.html` (petugas) dan `dasbor-saya.html` (nasabah)
Cadangan sebelum perubahan: `C:\Users\ACER\banksampahku-backup-dashboard-redesign-20261118-1828`

## 1. Ringkasan

Kedua dashboard ditulis ulang menjadi satu bahasa visual: panel, KPI, grafik, tabel, dan
catatan data yang konsisten, responsif 360–2560 px, serta berfungsi di Light dan Dark Mode.
Grafik dibuat sendiri dengan CSS/SVG (`js/grafik.js`) tanpa pustaka atau CDN baru. Sistem
autentikasi, sesi, dan data demo lama tidak diubah; `BankData` / `BankAuth` tetap dipakai.

## 2. Temuan Audit (sebelum perbaikan)

| Temuan | Bukti / dampak |
| --- | --- |
| Tidak ada grafik tren waktu | Dashboard lama hanya menampilkan daftar batang `<meter>` per jenis. Tidak terlihat naik/turun setoran harian. |
| Perbandingan jenis sulit | Batang `<meter>` terpisah tanpa angka persentase yang sejajar; sulit membandingkan porsi. |
| Panel tidak seragam | Lebar/tinggi kartu berbeda, KPI tidak sama lebar, judul panel tidak konsisten. |
| Overflow horizontal di 1024 px | Legenda donat (42 px) mendorong lebar halaman menjadi 1071 px pada viewport 1024 px. |
| Judul header terpotong di 360 px | `.app-judul` butuh 167 px, ruang tersedia 155 px. |
| Tabel setoran perlu digeser di ponsel | Tabel 5 kolom memaksa scroll horizontal internal. |
| Padding ganda pada dashboard baru | Aturan lama `body[data-layout="dashboard"] main { padding: 0 }` menimpa padding `.dash-isi`. |
| Legenda mewarisi gaya batang lama | `.legenda-item.dash-batang` membawa `grid-template-areas`, padding, dan latar kartu. |
| Komentar HTML usang | `dashboard.html` menyatakan halaman "statis tanpa JavaScript" padahal diisi `js/dashboard.js`. |
| Identitas ganda di header | Nama pengguna tampil di `.app-identitas` dan lagi di tombol profil. |

## 3. Keputusan Desain

- **Struktur**: `.dash-isi` (grid) berisi `.dash-sambutan`, `.kpi-grid`, `.grafik-grid`,
  `.grid-dua`, dan `.panel`. Halaman dashboard lama tetap memakai `.wadah` agar tidak rusak.
- **Panel**: satu radius, satu border, padding `var(--sp-5)`, kepala panel dengan judul +
  keterangan + aksi. Tidak ada bayangan berlebihan atau gradien dekoratif.
- **KPI**: 4 kolom sama lebar; 2 kolom pada ≤1200 px; 1 kolom pada ≤640 px.
- **Tipografi**: Public Sans untuk UI, IBM Plex Mono untuk angka (`font-variant-numeric:
  tabular-nums`), ukuran judul dashboard diturunkan agar tidak terbaca seperti landing page.
- **Warna grafik**: token `--grafik-1..5` (hijau, olive, ochre, biru-abu, teal) + varian
  gelap. Hijau merek hanya untuk garis tren utama dan progres.
- **Identitas**: hanya tombol profil di header; `.app-identitas` dihapus dari 8 halaman
  dashboard agar tidak ada nama ganda.
- **Motion**: transisi 150–220 ms (`--motion-mikro`), reveal GSAP yang sudah ada tetap
  dipakai, dan seluruh animasi dimatikan pada `prefers-reduced-motion`.
- **Anti-slop**: tanpa emoji, tanpa ikon campur, tanpa angka fiktif baru; setiap angka
  berasal dari `BankData` dan diberi label "Data demo".

## 4. Grafik Baru (`js/grafik.js`)

### Grafik garis / area
- Data dari `BankData.seriHarian()`: agregasi tanggal nyata; hari tanpa setoran tidak
  dibuat-buat, sehingga garis menunjukkan ritme setoran sebenarnya.
- SVG digambar manual: lebar internal = lebar wadah, `viewBox` diperbarui, teks sumbu
  tetap 10 px (tidak ikut menyusut). Tinggi 220 px (240 px di layar sempit).
- Sumbu Y memakai nilai bulat (0/10/20 kg); sumbu X hanya label berjarak ≥4 hari
  (mis. 1, 8, 15, 24 Okt) supaya tidak bertumpuk.
- Area memakai gradien dengan **ID unik per grafik** (dua grafik di satu halaman tidak
  saling menimpa).
- Tooltip mengikuti pointer: tanggal, berat, dan perkiraan rupiah; ada garis panduan.
- Ringkasan untuk pembaca layar disimpan di `<desc>` dan **dipertahankan saat redraw**.
- Redraw otomatis lewat `ResizeObserver` saat lebar panel berubah (sidebar, rotasi layar).
- Empty state: "Belum ada setoran pada periode ini." — bukan grafik kosong tanpa penjelasan.

### Donat komposisi
- 5 segmen dengan warna token, legenda berisi nama, kg, dan persentase sejajar.
- Segmen membesar saat hover; angka total dan satuan di tengah.
- Empty state: total `0`, satuan "belum ada data", legenda berganti pesan.
- Panel sempit ditumpuk (donat di atas legenda) pada ≤640 px; pada 1024–1100 px donat dan
  legenda tetap berdampingan karena panel sudah selebar kanvas.

### Batang per RT
- Skala mengikuti RT tertinggi (bukan 500 kg) agar perbedaan antar-RT tidak menyesatkan.
- Persentase kontribusi ditampilkan per baris; total RT ada di kepala panel.

## 5. Perbaikan Fungsi

- **Data langsung**: `tambahSetoran()` memperbarui KPI, grafik, tabel, dan total RT tanpa
  reload; `resetData()` mengembalikan tampilan awal.
- **Target >100%** (nasabah): bar penuh, persentase asli tetap tampil (mis. 175%),
  status "Target tercapai" dan "X kg di atas target bulan ini".
- **Tabel setoran ponsel**: di ≤640 px tabel berubah menjadi kartu dua baris
  (tanggal + nilai di atas; jenis, berat, dan rupiah di bawah). Tidak ada scroll horizontal.
- **Sidebar ponsel**: laci 280 px, tirai gelap di atas konten, tutup lewat klik di luar,
  Escape, atau tombol menu; fokus kembali ke tombol setelah ditutup.
- **Dropdown profil**: `aria-expanded`, `hidden`, Escape menutup dan mengembalikan fokus.
- **Tema**: pilihan tersimpan di `localStorage`, `aria-pressed` benar, `meta theme-color`
  ikut berubah.
- **Header**: judul tidak terpotong di 360 px; nama pengguna hanya di tombol profil.

## 6. Hasil QA

Matriks 13 halaman × 7 lebar (1920, 1440, 1366, 1024, 768, 390, 360):

- 0 overflow halaman (kecuali tabel lama yang memang punya wadah scroll sendiri).
- 0 error konsol, 0 permintaan gagal.
- 1920 px: konten utama dibatasi 1280 px; 2560 px tetap tanpa overflow.
- 1024 px: `scrollWidth` = 1009 px (tidak ada overflow); 768 px = 753 px; 390/360 px pas.
- Tidak ada judul header yang terpotong di semua lebar.

Uji fungsi:

| Uji | Hasil |
| --- | --- |
| Dropdown buka / Escape / fokus | `hidden=false → true`, `aria-expanded=true → false`, fokus kembali ke tombol |
| Tema terang ↔ gelap | `data-tema` dan `localStorage` berubah, `aria-pressed` benar |
| Tambah setoran | KPI 231,5 → 241,5 kg; transaksi 24 → 25; baris tabel dan grafik ikut berubah |
| Reset data | Kembali 231,5 kg / 24 transaksi |
| Target warga | 67,5 kg = 135%; setelah +20 kg menjadi 87,5 kg = 175%, bar 100/100 |
| Empty state | Grafik, donat, legenda, dan dua tabel menampilkan pesan kosong yang benar |
| Sidebar ponsel | Buka (lebar 280), tirai menutup saat klik luar, Escape menutup + fokus kembali |

Kontras (sampling Light + Dark, kedua dashboard): 0 kegagalan WCAG AA
(minimum 4,5:1 teks normal, 3:1 teks besar).

Tangkapan layar final ada di `docs/tangkapan-layout/`:
`dash-v2-petugas-*`, `dash-v2-warga-*` (1366/1024/390/360, terang/gelap, penuh),
`dash-v2-petugas-1920-terang.png`, `dash-v2-dropdown-1440.png`,
`dash-v2-tooltip-1440.png`, `dash-v2-sidebar-390.png`.

## 7. Sisa Masalah

1. **Tabel halaman lama** (`setoran.html`, `riwayat-setoran.html`, `buku-tabungan.html`,
   `harga.html`) masih memakai scroll horizontal internal di ≤640 px. Halaman tidak
   overflow, tetapi tabelnya harus digeser. Perbaikan berikutnya: terapkan pola kartu
   seperti `.tabel-setoran`.
2. **Halaman dashboard lain** (`profil.html`, `pengaturan.html`, `harga-sampah.html`,
   `setoran.html`) masih memakai struktur `.wadah` lama; belum diseragamkan dengan
   `.dash-isi`/`.panel`. Fitur berjalan normal.
3. **Autentikasi demo**: sesi disimpan di `localStorage` tanpa masa berlaku dan kata sandi
   contoh ada di `js/data.js`. Ini bukan autentikasi produksi dan tidak diubah pada
   pekerjaan ini.
4. **Data**: seluruh angka adalah data demo Oktober 2026 di browser, bukan transaksi nyata.
   Setiap dashboard dan footer sudah memberi label "Data demo" / catatan kaki.
5. **Belum ada commit**: semua perubahan masih di working tree (sesuai instruksi).

## 8. Berkas yang Berubah

- `css/style.css` — token grafik, shell, dan seluruh blok "DASHBOARD v2".
- `js/grafik.js` — renderer garis/area + donat, responsif, empty state, ARIA.
- `js/dashboard.js` — render petugas (KPI, legenda, donat, tren, RT, setoran, target).
- `js/dasbor-saya.js` — render nasabah (KPI, grafik, progres, riwayat, empty state).
- `js/auth.js` — sidebar ponsel: tirai, klik di luar, Escape, fokus.
- `dashboard.html`, `dasbor-saya.html` — struktur baru, `grafik.js`, `tabel-setoran`,
  catatan data yang akurat.
