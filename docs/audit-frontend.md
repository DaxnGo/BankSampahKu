# Audit frontend BankSampahKu

Audit ini memakai lima skill dari `emilkowalski/skills` yang dipasang ke `.codebuddy/skills/` melalui `npx skills@latest add emilkowalski/skills`.

## Ruang lingkup dan cara uji

- 8 halaman HTML dicek di lebar 320 px dan 1440 px.
- Data worst-case disuntikkan lewat `localStorage` sebelum halaman dimuat: 1.000 transaksi, nama panjang/aksara non-Latin/emoji, serta kondisi 0 dan 1 transaksi. Kode sumber tidak diubah untuk pengujian ini.
- `prefers-reduced-motion: reduce`, `prefers-color-scheme: dark`, dan zoom 200% (root font 32 px) diuji di browser.
- Syntax JS, tautan lokal, dan alur login → setoran → dashboard sudah divalidasi sebelumnya.

## Ringkasan

| Kategori | Hasil |
|---|---|
| Fungsional inti | Lolos — tidak ada error JavaScript di semua halaman dan semua kondisi data |
| Layout responsif | Lolos — tidak ada overflow halaman di 320 px, 1440 px, maupun zoom 200% |
| Data ekstrem | Sebagian lolos; satu bug inisial emoji dan satu empty state kosong |
| Mobile native | Perlu perbaikan — input 14,72 px, hover tidak dibatasi, tidak ada tap feedback/safe area |
| Animasi | **Block** untuk dashboard dan form; marketing boleh tetap |
| Aksesibilitas motion | Lolos — `prefers-reduced-motion` bekerja |

## Temuan (diurutkan dari yang paling berdampak)

| # | Severity | Field / area | Worst-case bukti | Yang terjadi | Fix | Lokasi |
|---|---|---|---|---|---|---|
| 1 | Broken | Inisial warga | Nama `🦊 Fox` | Inisial jadi satu surrogate karakter `U+D83E` (tampil sebagai kotak/rusak), bukan `🦊` | Pakai `Intl.Segmenter` atau `Array.from(nama)[0]` untuk inisial | `js/dasbor-saya.js:28`, `js/data.js:256` |
| 2 | Ugly | Input kontak | Computed font-size 14,72 px | iOS Safari otomatis zoom saat input disentuh dan tidak zoom balik | Ubah ke `1rem` / 16 px pada `.contact-form input, .contact-form textarea` | `css/style.css:287` |
| 3 | Ugly | Tabel dashboard | 0 transaksi | Baris RT dan setoran terbaru kosong total, tidak ada pesan "belum ada data" | Render satu baris placeholder di `isiTabelRt` dan `isiTabelSetoran` | `js/dashboard.js:76`, `js/dashboard.js:99` |
| 4 | Fragile | Mode gelap | `prefers-color-scheme: dark` | Latar tetap `rgb(251,246,236)`; README menyebut "Mode gelap" sebagai fitur, tetapi tidak ada implementasinya | Implementasikan dark mode atau hapus klaim di README | `README.md:31`, `css/style.css` bagian 5 kosong |
| 5 | Ugly | Hover | Desktop vs sentuh | Semua `:hover` aktif di perangkat sentuh; `.home-jelajah-kartu:hover` menggeser kartu dan state hover menempel setelah tap | Bungkus semua `:hover` dengan `@media (hover: hover) and (pointer: fine)` | `css/style.css:80, 163, 338, 881, 888, 1261, 1316, 1393, 1411, 1438` |
| 6 | Fragile | Kontrol sentuh | Tombol baru | Tidak ada `-webkit-tap-highlight-color`, `touch-action: manipulation`, atau `:active` pada tombol login/setoran/keluar; flash abu-abu dan respons terasa telat | Tambahkan baseline mobile-native | `css/style.css` (akhir berkas) |
| 7 | Fragile | Viewport | Semua halaman | `viewport-fit=cover`, `env(safe-area-inset-*)`, dan `theme-color` tidak ada | Tambahkan meta dan padding safe area pada header | `*.html:5` |
| 8 | Ugly | Angka live | Update setoran | Tidak ada `font-variant-numeric: tabular-nums`, jadi lebar angka berubah saat nilai diperbarui | Tambahkan ke `.dash-angka`, `.dash-batang-nilai`, `.setor-estimasi strong` | `css/style.css:1019, 1067, 1429` |
| 9 | Fragile | Batas input | Nama dan username | Tidak ada `maxlength` atau skema validasi; data lebih panjang bisa masuk lewat `localStorage` | Tentukan batas yang sama di form dan lapisan data | `login.html:56`, `kontak.html:124`, `js/data.js` |

## Motion: Before / After

Nilai mengikuti `STANDARDS.md` dan `AUDIT.md` dari skill: UI di bawah 300 ms dengan `cubic-bezier(0.23, 1, 0.32, 1)`; marketing/explanatory boleh lebih panjang.

| Before | After | Why |
|---|---|---|
| `gsap.defaults({ ease: "power3.out", duration: 0.8 })` untuk seluruh situs | `duration: 0.2`, `ease: "power3.out"` sebagai default; override 0.8–1.1 s hanya untuk hero/galeri | 0,8 s pada kartu dashboard dan form terasa lambat untuk UI |
| `gsap.from(header, { duration: 0.6 })` di setiap halaman | 0,2 s atau hapus | Header muncul di setiap navigasi, termasuk login dan dashboard |
| `gsap.from(dashKepala.children, { duration: 0.8, stagger: 0.1 })` | `duration: 0.2`, `stagger: 0.04` | Dashboard harus crisp, dan stagger 100 ms melebihi rentang 30–80 ms |
| `toggleActions: "restart reverse restart reverse"` pada `.kalkulator`, `.dash-target`, `.dash-tabel-bungkus`, `.form-card` | `toggleActions: "play none none none"` atau `once: true` | Konten memudar setiap kali digulir keluar masuk; terlalu sering untuk elemen UI |
| `stagger: 0.12` pada hero | `stagger: 0.08` | Batas atas yang disarankan adalah 80 ms |
| Tidak ada `:active` pada `.tombol-hitung`, `.demo-akun`, `.tombol-hapus`, `.nav-keluar` | `transform: scale(0.97)` dengan `transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1)` | Tekanan tombol perlu umpan balik instan |

### Verdict animasi

- **Feel-breaking:** reveal 0,8 s pada dashboard/form dan animasi yang diputar ulang saat scroll naik-turun.
- **Missed simplifications:** animasi header saat setiap pindah halaman.
- **Performance:** tidak ada `transition: all`, tidak ada animasi `width`/`height`, tidak ada `scale(0)` — ini sudah baik. GSAP berjalan di rAF, jadi bisa drop frame saat beban berat, tetapi tidak ada perbaikan GPU yang mudah tanpa mengganti stack.
- **Interruptibility:** tidak ada animasi pada toasts/toggles/gesters, jadi tidak ada masalah.
- **Accessibility:** `prefers-reduced-motion` sudah ditangani dengan benar di `js/animasi.js:13`; teruji opacity `1` dan transform `none`.

**Keputusan: Block** untuk permukaan dashboard dan form. Hero dan galeri boleh mempertahankan durasi saat ini karena termasuk kategori marketing/explanatory.

## Keputusan yang perlu kamu pilih

1. **Nama panjang di tabel setoran:** dibungkus dua baris atau dipotong dengan `title`? Rekomendasi: dibungkus, karena nama dipakai untuk identifikasi.
2. **Mode gelap:** diimplementasikan atau klaim di README dihapus? Untuk tugas kuliah, menghapus klaim lebih murah.
3. **Progress di atas 100%:** dengan 1.000 transaksi, teks menunjukkan ~2.870%. Tetap tampilkan angka apa adanya atau batasi tampilan jadi "100%+".

## Yang sudah tahan uji

- Tidak ada overflow halaman di 320 px, 1440 px, atau zoom 200% pada delapan halaman.
- Tabel melebar di dalam wrapper `.dash-tabel-bungkus` (`overflow-x: auto`), bukan merusak layout halaman — ini disengaja dan bekerja.
- 1.000 transaksi dirender tanpa error; tabel petugas dan dashboard tetap menampilkan 10 dan 5 baris teratas.
- Kondisi 0 dan 1 transaksi tidak menghasilkan `NaN`, `undefined`, atau division by zero.
- Tidak ada `transition: all`, `scale(0)`, atau `ease-in` pada UI.
- `prefers-reduced-motion` benar-benar mematikan gerakan, bukan sekadar deklarasi.

## Batasan

- Tidak ada uji di ponsel sungguhan; tap delay, sticky hover, safe area, dan perilaku keyboard hanya diverifikasi dari kode dan emulator.
- Audit ini tidak mencakup aksesibilitas penuh (misalnya kontras warna, urutan fokus, nama aksesibel) atau keamanan `localStorage`.
- Toggle **Demo data / Worst case** tidak ditambahkan secara permanen; worst case diuji dengan injeksi data di browser agar kode sumber tidak berubah.

## Status perbaikan

| Temuan | Status |
|---|---|
| 1 — inisial emoji | Diperbaiki dengan `Intl.Segmenter` di `js/data.js` dan `js/dasbor-saya.js` |
| 2 — input kontak 14,72 px | Diperbaiki menjadi `1rem` |
| 3 — empty state dashboard | Diperbaiki: baris placeholder pada tabel RT dan setoran |
| 4 — mode gelap | Diterapkan lewat `js/tema.js`, tombol di navigasi, dan variabel `html[data-tema="gelap"]` |
| 5 — hover tidak dibatasi | Diperbaiki: semua `:hover` dibungkus `@media (hover: hover) and (pointer: fine)` |
| 6 — kontrol sentuh | Diperbaiki: tap highlight, `touch-action`, `:active` 160 ms, fokus terlihat |
| 7 — viewport & theme-color | Diperbaiki di kedelapan halaman |
| 8 — angka bergetar | Diperbaiki dengan `font-variant-numeric: tabular-nums` |
| 9 — batas input | Masih terbuka: perlu keputusan batas panjang nama/username |

Koreksi terhadap laporan awal: perilaku **elemen muncul ulang saat digulir** di `js/animasi.js` adalah keputusan desain yang sudah dicatat di README, jadi **sengaja dipertahankan**. Yang diubah hanya durasi UI (0,8 s → 0,2 s) dan jeda stagger. Perbaikan masih perlu diverifikasi di ponsel sungguhan untuk tap delay, safe area, dan keyboard.
