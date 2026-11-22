# Laporan Implementasi GSAP Scroll Animation — BankSampahKu

Tanggal: 18 November 2026. Status: **IMPLEMENTED & VERIFIED**.
Backup: `banksampahku-backup-gsap-20261118-0842`.

## 1. Dependency

| Item | Versi | Sumber |
|---|---|---|
| GSAP | 3.15.1 | `vendor/gsap/gsap.min.js` (sudah ada) |
| ScrollTrigger | 3.15.1 | `vendor/gsap/ScrollTrigger.min.js` (sudah ada) |

Tidak ada library animasi baru, tidak ada CDN, tidak ada perubahan package manager.

## 2. Halaman yang mendapat animasi

13 halaman kini memuat urutan skrip yang konsisten:
`tema.js → data.js → auth.js → skrip halaman → gsap.min.js → ScrollTrigger.min.js → animasi.js`.

8 halaman dashboard yang sebelumnya tidak memuat GSAP kini dilengkapi:
`buku-tabungan`, `dasbor-saya`, `harga-sampah`, `login`, `pengaturan`, `profil`,
`riwayat-setoran`, `setoran`.

## 3. Jenis animasi

| Area | Animasi | Durasi | Trigger |
|---|---|---|---|
| Hero | Timeline: headline fade-up → deskripsi → CTA stagger → dekorasi | 260 ms, stagger 60 ms | Initial load, sekali |
| Judul section | Fade-up 10 px | 260 ms | ScrollTrigger `top 88%`, `once` |
| Kartu (manfaat, jelajah, kategori, gallery, info, statistik, harga, buku) | Fade-up 12 px + stagger 60 ms | 260 ms | ScrollTrigger per grup, `once` |
| Angka statistik | Count-up dari nilai asli yang dirender page script | 600 ms | ScrollTrigger `top 92%`, `once` |
| Navbar publik | Bayangan bertambah saat scroll > 12 px | 180 ms | ScrollTrigger `start:12`, tanpa hide/show |
| Parallax | Hanya `.home-jelajah-ikon`, desktop 10 px / tablet 5 px | scrub 0.6 | ScrollTrigger `top bottom → bottom top` |
| Back-to-top | Fade + slight scale (CSS existing) | 200 ms | Scroll > 300 px |

Tidak ada: bounce, rotasi berlebih, horizontal scroll, scroll hijacking, parallax pada form/tabel/teks utama.

## 4. ScrollTrigger dibuat

- 1 trigger navbar per halaman publik (dashboard memakai `.app-header`, sengaja tidak di-hide/show).
- 1 trigger per grup kartu yang relevan.
- 1 trigger per elemen angka statistik.
- 1 trigger parallax desktop/tablet (tidak ada di mobile).
- Total terukur per halaman: 0–7 trigger aktif; trigger ber-`once` dibebaskan setelah selesai.

## 5. Data & counter

Angka dihitung dari `BankData` yang sudah dirender sebelum `animasi.js` berjalan.
Nilai akhir—`Rp 140.250`, `67,5`, `7`, dll.—tidak diubah; format Indonesia dipertahankan.
Lebar elemen dikunci sementara selama count-up agar tidak ada layout shift, lalu dikembalikan.

## 6. Aksesibilitas & reduced motion

- `prefers-reduced-motion: reduce` → script kembali lebih awal, **0 ScrollTrigger**, seluruh konten langsung terlihat (opacity 1).
- Fokus keyboard dan ring 3 px tidak terganggu.
- Tidak ada konten yang tersembunyi permanen setelah scroll cepat, scroll balik, atau refresh.

## 7. Responsive & performa

- Mobile: parallax **dinonaktifkan** lewat `gsap.matchMedia()`.
- Tablet: jarak parallax dikurangi menjadi 5 px.
- Transform/opacity yang dianimasikan; tidak ada animasi property layout.
- `gsap.context()` + `mm.revert()` dipanggil saat `pagehide`; inisialisasi ulang saat `pageshow` bfcache.
- `ScrollTrigger.refresh()` setelah `load` dan `document.fonts.ready`.
- Navigasi index → kontak → index lagi: jumlah trigger tetap 6 (tidak duplikat).

## 8. Pengujian

| Pengujian | Hasil |
|---|---|
| Hero, reveal kartu, navbar shadow, count-up, parallax | Lolos |
| Scroll cepat, lambat, balik ke section sebelumnya | Lolos, 0 elemen tersembunyi |
| Refresh & navigasi antarhalaman | Lolos, tanpa duplikat trigger |
| Light/Dark mode | Lolos, tanpa flicker |
| Reduced motion | Lolos, 0 trigger |
| 234 konfigurasi (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error, 0 permintaan gagal |

## 9. Masalah ditemukan & diperbaiki

| Masalah | Status |
|---|---|
| 8 halaman dashboard tidak memuat GSAP/ScrollTrigger | FIXED & VERIFIED |
| Card hover tidak memiliki transisi | FIXED & VERIFIED (dari audit motion sebelumnya) |
| Potensi layout shift saat count-up | FIXED & VERIFIED dengan min-width sementara |
| Risiko duplikat timeline saat bfcache | FIXED & VERIFIED dengan context cleanup |

## 10. NOT TESTED

- Uji profiler performa kuantitatif (FPS) di perangkat low-end fisik.
- Uji gesture sentuh nyata pada tablet/mobile.

## 11. File berubah

- `js/animasi.js` — seluruh implementasi GSAP + ScrollTrigger.
- `css/style.css` — bayangan navbar saat scroll.
- 8 file HTML — urutan skrip GSAP.
- `docs/laporan-gsap.md` — laporan ini.

**Prinsip dipertahankan:** subtle motion, purposeful animation, natural scroll, zero distraction.
