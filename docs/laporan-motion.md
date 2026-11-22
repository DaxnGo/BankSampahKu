# Laporan Audit Motion Design — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.
Backup: `banksampahku-backup-motion-20261118-0831`.

## 1. Inventaris animasi ditemukan

| Komponen | Sebelum | Standar | Status |
|---|---|---|---|
| Transisi tombol/CTA | 100–200 ms, easing `ease` | 150–200 ms | FIXED & VERIFIED |
| Kartu Jelajahi | Tidak ada transisi (hover langsung) | 180–220 ms | FIXED & VERIFIED |
| Modal video & login | 220 ms, timer JS 200 ms | 180–250 ms | FIXED & VERIFIED |
| Sidebar drawer | 220 ms | 180–250 ms | ALREADY WORKING → diselaraskan 200 ms |
| Back-to-top | 200 ms | 150–200 ms | ALREADY WORKING |
| Page entrance (GSAP) | 400–500 ms | 200–300 ms | FIXED & VERIFIED |
| Theme toggle | Tanpa feedback warna | 120–180 ms | FIXED & VERIFIED |
| Dropdown profil | Muncul instan | 150–200 ms | FIXED & VERIFIED |
| Theme change | Instan | Boleh 150–200 ms | FIXED & VERIFIED |
| Login spinner | 700 ms infinite | Fungsional loading | ALREADY WORKING |
| Scroll ke atas | `behavior: smooth` | Fungsional | ALREADY WORKING |
| Dekorasi statis (stempel -8°, label -3°, ikon -7°, teks vertikal) | Tidak bergerak | Bukan animasi | ALREADY WORKING |

Tidak ditemukan: bounce berlebih, zoom besar, parallax, infinite animation dekoratif, atau animasi yang menyebabkan layout shift.

## 2. Perbaikan diterapkan

### Token motion baru
`--motion-mikro: 150ms`, `--motion-kontrol: 180ms`, `--motion-kartu: 200ms`,
`--motion-modal: 200ms`, `--motion-masuk: 260ms`, `--ease-motion: cubic-bezier(.22,1,.36,1)`.

### CSS
- Transisi tombol tema: `background-color`, `border-color`, `transform` 150 ms.
- Kartu Jelajahi: transisi `transform` + `box-shadow` 200 ms.
- Modal video, login modal, dan sidebar drawer: 200 ms, sinkron dengan timer JS 200 ms.
- Body: transisi `background-color` dan `color` 180 ms saat ganti tema.
- Dropdown profil: animasi `dropdown-masuk` 180 ms (opacity + translateY 4 px).
- Seluruh easing disatukan ke `--ease-motion`.

### JavaScript
- `js/animasi.js`: durasi entry dibaca dari token `--motion-masuk` (260 ms), header 220 ms, stagger 50 ms.
- Dua momen masuk dipertahankan; tidak ada ScrollTrigger, tidak ada pengulangan saat scroll.

## 3. Animasi yang dipertahankan

- **Spinner login** 700 ms infinite — indikator loading fungsional, bukan dekorasi.
- **Fade + scale modal** 200 ms — memberi fokus tanpa gerakan berlebih.
- **Transisi warna tema** 180 ms — halus, tanpa kedip.
- **Smooth scroll** back-to-top — fungsional, dan otomatis `auto` saat reduced motion.
- **Rotasi statis** pada stempel dan label — bagian dari karakter visual, bukan animasi.

## 4. Verifikasi browser

| Pengujian | Hasil |
|---|---|
| Durasi terukur: body 180 ms, CTA 200 ms, kartu 200 ms, modal 200 ms, tombol tema 150 ms, spinner 700 ms | Lolos |
| Modal login buka/tutup | Lolos, timer sinkron dengan transisi |
| Ganti tema: latar berubah, ukuran header identik (1180×64) | Lolos, tanpa layout shift |
| `prefers-reduced-motion: reduce` | Semua durasi → `1e-05s` |
| Keyboard focus 3 px | Lolos |
| 234 konfigurasi (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error, 0 permintaan gagal |

## 5. Status

| Area | Status |
|---|---|
| Motion konsistensi | FIXED & VERIFIED |
| Page entrance | FIXED & VERIFIED |
| Modal & dropdown | FIXED & VERIFIED |
| Theme transition | FIXED & VERIFIED |
| Reduced motion | FIXED & VERIFIED |
| Fungsional spinner & smooth scroll | ALREADY WORKING |
| Uji perangkat sentuh nyata | NOT TESTED |

## 6. Rekomendasi lanjutan

1. Jika diperlukan, uji kurva easing dengan pengguna nyata (preferensi subjektif tetap berbeda).
2. Hindari menambah animasi baru kecuali ada kebutuhan UX yang jelas.
3. Pertahankan prinsip: **less animation, better experience**.

## 7. File berubah

- `css/style.css` — token motion, transisi tombol/kartu/modal/sidebar/dropdown/body.
- `js/animasi.js` — durasi dari token, entrance 260 ms.
- `docs/laporan-motion.md` — laporan ini.
