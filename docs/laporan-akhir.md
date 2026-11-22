# Laporan Akhir Audit Redesign BankSampahKu

Status: **Gerbang 1 sampai 6 selesai**. Tidak ada gerbang yang ditunda.

Arah: CSS dan SVG sendiri, font lokal, ikon SVG inline, tanpa pustaka atau CDN baru.
GSAP existing dipertahankan. Semua kontrak lama dijaga: 34 data-metric, urutan
skrip, struktur nav, dan form tidak diubah nama/strukturnya.

Rincian Gerbang 1 ada di `docs/laporan-gerbang-1.md`.
Tangkapan 375 dan 1280 px ada di `docs/tangkapan-gerbang-1/`.
Lisensi pihak ketiga ada di `docs/THIRD-PARTY.md`.
Daftar cek manual ada di `docs/daftar-cek-manual.md`.

## Gerbang 2 — Prototipe Beranda

Beranda kini punya elemen khas bank sampah: **Buku Tabungan Sampah** dengan
punggung buku bernomor nasabah, ringkasan saldo/berat, tiga setoran terakhir,
serta **stempel status TERVERIFIKASI** berbentuk lingkaran bergaris putus-putus.
Sistem memakai token baru, body 17 px, line-height 1,6, tanpa krem dan tanpa
tekstur kertas. Tangkapan 375/1280 px tersimpan di folder tangkapan.

## Gerbang 3 — Terapkan ke semua halaman

- `index.html`: buku tabungan + stempel; hero mencakup WebP; ikon SVG.
- `memilah.html`: hero dan kartu langkah memakai token; ikon SVG; breakpoint 900.
- `harga.html`: tabel harga dan kalkulator memakai token; angka memakai mono.
- `kontak.html`: H1, skip link, meta, tautan aktif, ikon SVG, tabel jam responsif.
- `login.html`: pada 600 px form tampil lebih dulu lewat urutan flex; penjelasan menyusul, urutan DOM tetap ramah pembaca layar.
- `dashboard.html`: 34 metric, grafik, Ikon SVG, tanpa gradien dekoratif.
- `setoran.html`: form dan tabel dengan token; aksi Hapus tetap berfungsi.
- `dasbor-saya.html`: angka bersumber dari agregat yang sama dengan dashboard.

Mode gelap sekarang hanya menimpa token warna; override warna per elemen = 0.
Dua aturan gelap yang tersisa hanya mengganti ikon bulan/matahari pada tombol tema.
Breakpoint disatukan menjadi tiga nilai: **600, 900, 1200 px** (dari 9 nilai).

## Gerbang 4 — Dashboard dan data

- `BankData.getAggregates()` ditambahkan sebagai **fungsi baru**; `ringkasan()` dan `ringkasanWarga()` tidak diganti atau dihapus.
- Dashboard mengisi 34 `data-metric` dari agregat tersebut; dasbor-saya memakai `agregat.perWarga[sesi.userId]`.
- Angka terverifikasi: total **231,5 kg**, **4 penabung**, saldo **Rp 506.750**, target **400 kg** (**57,9%**); warga w1 **67,5 kg** dan **Rp 140.250** — keduanya dari satu sumber.
- Fallback tanpa JS memakai angka contoh yang sama dengan data awal dan label **Data contoh**; label berubah menjadi **Data demo di browser** hanya saat JS aktif dan data berasal dari penyimpanan.
- Dua grafik SVG buatan sendiri: **komposisi per jenis** dan **progres target**. Masing-masing punya judul, ringkasan teks, dan tabel data di dalam `<details>`. Tidak ada tren bulanan dan tidak ada bulan rekayasa.

## Gerbang 5 — Foto, ikon, gerak

- Foto: 5 gambar dikonversi dengan Pillow ke WebP 800w dan 1600w (maks 1600 px) di `img/web/`; foto asli tidak dihapus. Semua gambar punya width/height, `srcset`, `sizes`, dan lazy untuk yang di bawah lipatan. Hero memakai rasio asli tanpa `object-fit: cover`.
- Ikon: 21 nama ikon Tabler yang dipakai diganti SVG inline stroke (78 elemen `svg.ikon`). Tautan stylesheet ikon dihapus dari seluruh halaman.
- Gerak: hanya 2 momen (header dan isi utama), tanpa `restart reverse`, tanpa ScrollTrigger aktif. `prefers-reduced-motion` juga ada di CSS. Konten tidak pernah disembunyikan oleh CSS.
- **Folder `vendor/tabler-icons/` sengaja belum dihapus** sesuai instruksi untuk memberi tahu dulu sebelum penghapusan. Halaman sudah tidak memuatnya.

## Gerbang 6 — Verifikasi akhir

### Skor rubrik (0 sampai 5)

| Dimensi | Sebelum | Sesudah | Dasar |
| --- | --- | --- | --- |
| Sistem token | 2 | 5 | `:root` 2 menjadi 1; token 39 menjadi 68; warna literal 19 menjadi 0 |
| Tipografi | 2 | 5 | font-size literal 40 menjadi 3 (sisanya teks SVG), bobot 900 hilang |
| Aksesibilitas | 2 | 5 | skip link 7/8 menjadi 8/8, H1 8/8, tautan mati 3 menjadi 0, fokus 9 menjadi 1 |
| Responsif | 3 | 5 | breakpoint 9 menjadi 3, satu tinggi header, tanpa overflow 375/1280 |
| Aset dan font | 1 | 5 | Google Fonts 3 menjadi 0, font lokal 5 berkas, WebP + SVG inline |
| Integritas data | 2 | 5 | `getAggregates()` baru, 34 metric, angka dashboard dan warga cocok |
| Gerak | 2 | 5 | pengulangan 6 menjadi 0, reduced motion di CSS dan JS, konten tidak tersembunyi |
| Kebersihan kinerja | 2 | 4 | tanpa permintaan eksternal, tapi jejak aset Kontak masih ~2,2 MB |
| **Total** | **16/40** | **39/40** | |

### Detektor slop sebelum dan sesudah

| Penanda | Sebelum | Sesudah |
| --- | --- | --- |
| gradien dekoratif | 6 | 0 |
| font-weight 900 | 3 | 0 |
| gaya fokus berbeda | 9 | 1 |
| breakpoint lebar berbeda | 9 | 3 |
| warna literal di aturan | 19 | 0 |
| tautan tanpa `href` | 3 | 0 |
| glif `!` sebagai ikon | 3 | 0 |
| Google Fonts | 3 | 0 |
| tautan CSS font ikon | 8 | 0 |
| `restart reverse` | 6 | 0 |
| `innerHTML` | 1 | 0 |
| gambar tanpa width/height | 2 | 0 |
| URL eksternal | 3 | 1 (wa.me, disengaja) |
| `lorem ipsum` / kata isian | 0 | 0 |
| `!important` | 0 | 4 (khusus reduced motion) |

Skor bendera slop turun dari **106 menjadi 12**; sisa 12 terdiri dari 1 gradien CTA,
3 breakpoint, 1 URL wa.me, dan 4 deklarasi reduced motion (semuanya disengaja)
plus 3 ukuran font SVG.

### Ukuran total per halaman

Ukuran dihitung dari HTML + aset lokal unik yang dirujuk (CSS, JS, font, dan
semua varian WebP di `srcset`). Angka di browser lebih kecil karena hanya satu
varian WebP yang diunduh per gambar.

| Halaman | HTML | Total aset |
| --- | --- | --- |
| index.html | 14,7 KB | 484,5 KB |
| memilah.html | 10,8 KB | 480,5 KB |
| harga.html | 10,7 KB | 483,7 KB |
| kontak.html | 13,8 KB | 2.224,7 KB |
| login.html | 8,6 KB | 180,9 KB |
| dashboard.html | 18,5 KB | 499,6 KB |
| setoran.html | 9,0 KB | 184,5 KB |
| dasbor-saya.html | 8,7 KB | 182,9 KB |

### Hasil verifikasi otomatis

- 8 halaman dimuat di Chrome headless dengan cache dimatikan: **0 galat JS, 0 gagal jaringan**.
- `scrollWidth` sama dengan lebar viewport (375 dan 1280) di semua halaman.
- 34 `data-metric` tanpa duplikat; 2 grafik SVG dengan 2 tabel `<details>`.
- Tombol tema: `terang → gelap`, ikon bulan/matahari, `theme-color #F4F6F2 → #0f1611`.
- Font Public Sans dan IBM Plex Mono termuat; angka memakai `tabular-nums`.
- Tidak ada perintah git yang mengubah keadaan repository.

Daftar hal yang perlu dicek manual ada di `docs/daftar-cek-manual.md`.
Lisensi lengkap ada di `docs/THIRD-PARTY.md`.

**Pekerjaan selesai.**

## Catatan perubahan tambahan

- Gambar hero dihapus hanya dari `index.html`, `memilah.html`, dan `harga.html`; foto galeri dan berkas asli tetap ada.
- Navbar: garis bawah tipis, jarak antaritem lebih rapat, pemisah untuk menu akun, serta tombol tema berpermukaan.
- Footer: grid tiga kolom, ikon sosial berbentuk lingkaran, gelombang lebih tipis, dan dekorasi bin lama disembunyikan agar tampilan identik di semua halaman (berkas tidak dihapus).
- Tangkapan 375/1280 diperbarui; tanpa gulir horizontal, tiga breakpoint.

## Catatan CTA Hero

Hero Beranda kini memakai dua tombol berdampingan: **Pelajari Cara Memilah**
(ikon daur ulang kiri, panah kanan, `#145C46`, teks putih, pill, shadow dan hover)
serta **Lihat Video** (ikon play, transparan, border hijau, teks hijau, pill).
Keduanya satu baris di desktop dan penuh lebar di ponsel. Tidak ada aset video
di proyek, sehingga tombol kedua sengaja `disabled` dan diberi keterangan
`Video edukasi belum tersedia` tanpa URL palsu. Token `--hijau-cta` juga punya
nilai terang untuk mode gelap.

## Catatan Video Player Modal

`js/video-modal.js` menyediakan modal `<video>` HTML5 dengan kontrol yang benar-benar
berfungsi: putar/jeda, mundur 10 detik, maju 10 detik, seek, volume/mute, waktu dan
durasi, kecepatan 0.5x sampai 2x, serta layar penuh. Modal ditutup lewat tombol X,
Escape, atau klik overlay; klik pada video tidak menutup. Saat ditutup video dijeda,
posisi diulang ke awal, dan kecepatan dikembalikan ke 1x. Fokus dikembalikan ke tombol
pemicu dan latar tidak bergeser.

Sumber sekarang memakai video edukasi sungguhan dari YouTube:
`https://youtu.be/CGd3lgxReFE?si=xAssguklxTyoOtXJ` — judul hasil oEmbed resmi:
**Video Animasi Cara Pengelolaan Sampah, "Sampahku Tanggung Jawabku"** oleh APix Media.
Karena YouTube bukan berkas HTML5, modal memakai iframe resmi `youtube-nocookie.com`
dan pemutar YouTube menyediakan play/pause, 10 detik mundur/maju, seek, volume,
durasi, kecepatan, serta fullscreen. Tidak ada `autoplay=1`; iframe dihapus setiap kali
modal ditutup sehingga pemutaran benar-benar berhenti. Jika sumber diganti berkas lokal,
modal kembali memakai elemen `<video>` dan kontrol kustom bawaan proyek.

## Catatan Redesign Navbar & Footer

Navbar floating dan sticky: logo di kiri, lima menu dengan ikon di tengah, pill profil,
toggle tema, dan hamburger di kanan. Menu aktif berbentuk pill forest green; hover
lembut dan latar translusen dengan blur. Di layar ≤900 px menu menjadi hamburger.
Dropdown akun, dark mode, autentikasi, dan alur login tetap berfungsi.

Footer forest green gelap berisi tiga kolom: brand + sosial, Navigasi Cepat, dan
Hubungi Kami dengan kontak sungguhan dari proyek (telepon, email, alamat Manado).
Kolom pesan lingkungan yang sebelumnya ada sudah dihapus sesuai permintaan. Footer
bottom memuat copyright dan teks kebijakan/syarat (bukan tautan palsu karena halamannya
belum ada). Tombol Kembali ke Atas kini mengambang di pojok kanan bawah, muncul setelah
halaman digulir lebih dari 300 px, menghilang kembali di posisi atas, dan memakai
scroll halus yang mengikuti preferensi reduced motion.

Verifikasi: 0 galat JS/jaringan, satu `aria-current` per halaman, header/footer identik
di delapan halaman, tanpa overflow 375/1280, satu `:root`, tiga breakpoint, serta
kontrak 34 `data-metric` dan urutan skrip terjaga.

