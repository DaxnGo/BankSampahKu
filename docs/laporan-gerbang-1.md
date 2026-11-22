# Laporan Gerbang 1 — Fondasi

Catatan: gerbang 2 sampai 6 juga sudah selesai; lihat `docs/laporan-akhir.md`.

Status: **SELESAI**. Berhenti di sini, menunggu `LANJUT`.

Arah yang dipakai: CSS + SVG sendiri, font lokal, ikon Tabler menjadi SVG inline pada Gerbang 5.
Tidak ada pustaka, CDN, atau permintaan jaringan baru. GSAP existing belum diubah.

---

## a. Fondasi CSS — satu `:root` berlapis

`css/style.css` sekarang memuat **satu** `:root` dan **satu** `body` (sebelumnya dua pasang).
Blok gelap lama yang mengulang `:root` dihapus; mode gelap kini hanya menimpa token.

| Lapisan | Isi |
| --- | --- |
| BASE | warna, 6 langkah tipe (`--teks-1`…`--teks-6`), 9 langkah jarak (`--sp-1`…`--sp-9`), radius 4/8/12/pill, 2 bayangan, token fokus |
| SEMANTIK | `--latar`, `--permukaan`, `--teks`, `--garis`, `--aksen`, `--bahaya`, dll. |
| KOMPONEN | `--tinggi-header: 72px`, `--ukuran-ikon-kontak`, `--ukuran-sentuh: 44px`, `--radius-kartu`, `--radius-tombol` |

Hasil pengukuran: `:root` = 1, `body{` = 1, `linear-gradient` = 1 (CTA saja),
font-size literal = 0, bobot 900/800 = 0, `letter-spacing` berlebihan = 0,
hex literal di luar definisi token = 0, kurung seimbang (361/361), 68 token terdefinisi / 66 terpakai
(`--hijau-600` dan `--sp-9` sengaja disediakan untuk gerbang berikutnya).

## b. Font lokal

Sumber resmi npm, versi dipin, rilis 2026-07-19 (>14 hari):
- `@fontsource/public-sans@5.3.0` — 400, 600, 700 (3 bobot UI)
- `@fontsource/ibm-plex-mono@5.3.0` — 400, 600 (2 bobot mono)

5 berkas `.woff2` + 2 teks lisensi OFL-1.1 di `assets/fonts/` (total 82 KB).
Semua `@font-face` memakai `font-display: swap`; 2 preload per halaman; Google Fonts
sudah hilang dari seluruh HTML. Uang/berat memakai IBM Plex Mono + `tabular-nums`
(terverifikasi di browser: `fontFamily` mono, `fontVariantNumeric: tabular-nums`).

## c. Satu gaya fokus

Satu aturan `:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible`
dari `--fokus` (`#1d4ed8`, gelap `#8ab4ff`) dan `--fokus-lebar: 3px`, `outline-offset: 3px`.
Lima blok fokus lama dihapus. Kontras ring terhadap latar teranggelap memenuhi 3:1.

## d. Perbaikan cepat

| Butir | Tindakan |
| --- | --- |
| 1 Kontak | H1 "Hubungi BankSampahKu" + lead, skip link, meta description, 4 ikon PNG diganti ikon Tabler seragam (pin, telepon, jam, kirim). Banner lama **tidak dipakai** lagi karena teks di dalam gambar menggandakan H1 dan latar kremnya bertentangan dengan palet baru. Berkas gambar asli tetap ada. |
| 2 `aria-current` | Halaman publik tepat satu. Halaman warga/petugas tidak punya entri statis di nav; `auth.js` kini memberi `aria-current="page"` pada entri dinamis ("Dashboard Saya" / "Input Setoran") yang sesuai halaman, dan menghapus penanda lama pada tautan "Masuk". |
| 3 Tautan mati | "Lihat di Peta" → `#peta-lokasi`; telepon → `tel:+6281234567890`; WhatsApp → `https://wa.me/6281234567890`. |
| 8 Gradien | 5 gradien dekoratif dihapus; satu-satunya yang tersisa adalah CTA `.home-cta`. |
| 9 Tipografi | bobot 900→700 (3×) dan 800→700 (14×), `line-height` judul 1,2 lewat token, `letter-spacing -.04/-.035em` → `-.01em`. |
| 10 Glif `!` | Diganti ikon `ti-info-circle` di `dashboard.html`, `dasbor-saya.html`, dan `setoran.html`. |

Perbaikan tambahan yang ditemukan saat mengerjakan: `<div>` penutup yang hilang pada
`contact-main-grid` Kontak, dua atribut `height="auto"` tidak valid, tabel jam operasional
ditumpuk di layar kecil, dan duplikasi aturan `.contact-hero` disatukan.

## e. Header, nav, tombol tema

- Tombol tema **statis di HTML** di semua 8 halaman, setelah `</nav>`.
- `js/tema.js` tidak lagi menyuntik elemen; hanya mengikat klik dan mengganti ikon lewat `classList` (tanpa `innerHTML`). Tanpa JS tombol tetap tampil tetapi tidak berfungsi — sesuai izin.
- Satu `min-height: var(--tinggi-header)` (72 px). Di ≤900 px, merek + tombol tema berada di baris pertama dan nav menggulir horizontal di baris kedua, sehingga tidak meluber di 1280.
- Terukur di 1280 (setoran, sesi petugas): ujung nav 1146 px, tombol mulai 1162 px, jarak 16 px, `scrollWidth` = 1280 (tidak ada overflow).
- Header/nav identik di 8 halaman setelah penanda halaman aktif dinetralkan.
- Uji klik tombol: `terang → gelap`, ikon `ti-moon → ti-sun`, label berubah, `theme-color` `#F4F6F2 → #0f1611`.

## f. Investigasi `dasbor-saya.html`

**Penyebab gagal render 3× bukan galat JS.** `auth.js` memeriksa
`<body data-halaman="warga:dasbor-saya.html">`; bila `localStorage` tidak berisi sesi,
`butuh()` menjalankan `window.location.replace("login.html?lanjut=dasbor-saya.html")`.
Konsol bersih; pengalihan memang disengaja sebagai pengaman halaman warga.

Saya memasang sesi warga (`userId: w1`, Siti Aminah) lalu halaman tampil normal
(`location.pathname` tetap `/BankSampahKu/dasbor-saya.html`). Nilai dari tangkapan layar:

- Saldo bulan ini **Rp 140.250**; total sampah **67,5 kg**; jumlah setoran **7 kali**; target pribadi **50 kg**
- Progres target **135%** (67,5 dari 50 kg)
- Setoran per jenis: Logam 6 kg, Kertas 10 kg, Plastik 26,5 kg, Kaca 14 kg, Kardus 11 kg
- Riwayat: 7 transaksi, 3 Oktober–19 Oktober 2026

Angka agregat dashboard (putaran yang sama): total **231,5 kg**, **4 penabung**,
saldo **Rp 506.750**, target 400 kg (**57,9%**). Keduanya memang berbeda cakupan
(agregat vs perorangan). Penyatuan sumber lewat `BankData.getAggregates()` baru
dilakukan di Gerbang 4 sesuai urutan kerja.

---

## Kontrak yang dijaga

- `dashboard.html`: **34 `data-metric`** masih utuh, 9 atribut `id` unik; `dasbor-saya.html`: 21 `id` (sama seperti baseline).
- Urutan skrip tidak berubah: `tema.js → data.js → auth.js → halaman → gsap → ScrollTrigger → animasi.js`.
- API lama `BankData`/`BankAuth` tidak diganti nama atau dihapus; perubahan hanya penambahan penanda `aria-current` di `auth.js`.
- 34 angka statis fallback belum disentuh.
- Tidak ada perintah git yang mengubah keadaan.

## Tangkapan layar

Lebar viewport asli 375 px dan 1280 px (bukan iframe). Diambil dengan Chrome headless
memakai `prefers-reduced-motion: reduce` supaya GSAP/ScrollTrigger tidak menyembunyikan
konten di bawah lipatan pada saat pengambilan. Tersimpan di `docs/tangkapan-gerbang-1/`:

`index`, `memilah`, `harga`, `kontak`, `login`, `dashboard`, `setoran`, `dasbor-saya`
— masing-masing `-375.png` dan `-1280.png` (16 berkas).

Semua halaman memiliki `scrollWidth` sama dengan lebar viewport: tidak ada gulir horizontal.

## Yang sengaja ditunda

- **Gerbang 2**: Beranda belum diprototipe dengan buku tabungan + stempel status.
- **Gerbang 3**: urutan form-dulu di login ponsel, penyatuan 16 breakpoint menjadi 3, override gelap tersisa.
- **Gerbang 4**: `getAggregates()`, grafik SVG, penyelarasan angka, label "Data contoh"/"Data demo".
- **Gerbang 5**: WebP 1600 px (foto gallery masih 3–4 MB), SVG inline pengganti font ikon (font Tabler masih dipakai), dan `toggleActions: "restart reverse restart reverse"` masih ada di `animasi.js`.
- **Gerbang 6**: rubrik, THIRD-PARTY.md, ukuran halaman, dan daftar cek manual.

**Berhenti di Gerbang 1. Menunggu `LANJUT`.**
