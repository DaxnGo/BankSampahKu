 # Design Tokens - BankSampahKu

Dokumen ini merangkum token yang menjadi satu sumber keputusan visual.
Semua komponen baru sebaiknya memakai token ini, bukan nilai literal.

Sumber: css/style.css - satu :root dan satu override html[data-tema="gelap"].

## Prinsip

1. Satu sumber warna. Light dan dark memakai nama token yang sama; nilai yang berubah ada di override tema.
2. Bentuk dua kelompok. Radius kecil (4/8/12 px) untuk kontrol, pill untuk status dan CTA.
3. Overlay dua tingkat. --overlay-1 untuk dialog, --overlay-2 untuk modal video/login.
4. Ikon mengikuti teks. Sebagian besar SVG memakai currentColor; warna logo dan ilustrasi asli dipertahankan.
5. Monospace hanya untuk angka. --font-angka dipakai pada uang, berat, dan tabel angka.

## Skala dan token utama

### BASE: warna

| Token | Light | Dark |
|---|---|---|
| `--kertas-50` | #fbf6ec | #101c18 |
| `--kertas-100` | #dcf3c6 | #162720 |
| `--putih` | #f6efdc | #1c3028 |
| `--tinta-900` | #1f2937 | #f1f5f0 |
| `--tinta-600` | #4b5563 | #c0cec4 |
| `--tinta-muda` | #5b6675 | #9bafa2 |
| `--hijau-800` | #14532d | #7cb342 |
| `--hijau-700` | #2e7d32 | #9ccc65 |
| `--hijau-cta` | #2e7d32 | #9ccc65 |
| `--video-bg` | #102d24 | — |
| `--video-teks` | #f6efdc | — |
| `--modal-radius` | 14px | — |
| `--video-radius` | 12px | — |
| `--hijau-100` | #dcf3c6 | #243b31 |
| `--kuning-500` | #fcd34d | #d9a93a |
| `--biru-700` | #1e5fa8 | #8ab8ea |
| `--biru-100` | #dce8f7 | #16293d |
| `--merah-700` | #a3271f | #f09a93 |
| `--merah-100` | #f7dedb | #3a1d1a |

### BASE: tipe, 6 langkah

| Token | Light | Dark |
|---|---|---|
| `--teks-1` | .8125rem | — |
| `--teks-2` | .9375rem | — |
| `--teks-3` | 1.0625rem | — |
| `--teks-4` | 1.3125rem | — |
| `--teks-5` | clamp(1.625rem, 2.4vw, 2rem) | — |
| `--teks-6` | clamp(2rem, 4.2vw, 2.875rem) | — |
| `--lh-rapat` | 1.2 | — |
| `--lh-judul` | 1.3 | — |
| `--lh-teks` | 1.6 | — |
| `--font-ui` | "Public Sans", "Segoe UI", system-ui, -apple-system, Arial, sans-serif | — |
| `--font-angka` | "IBM Plex Mono", ui-monospace, "Cascadia Mono", Consolas, monospace | — |
| `--ukuran-ikon-kartu` | 2.25rem | — |

### BASE: jarak, skala 4

| Token | Light | Dark |
|---|---|---|
| `--sp-1` | 4px | — |
| `--sp-2` | 8px | — |
| `--sp-3` | 12px | — |
| `--sp-4` | 16px | — |
| `--sp-5` | 20px | — |
| `--sp-6` | 24px | — |
| `--sp-7` | 32px | — |
| `--sp-8` | 48px | — |

### BASE: bentuk, bayangan, fokus

| Token | Light | Dark |
|---|---|---|
| `--radius-1` | 4px | — |
| `--radius-2` | 8px | — |
| `--radius-3` | 12px | — |
| `--radius-pill` | 999px | — |
| `--bayangan-1` | 0 1px 2px rgb(31 41 55 / .08) | 0 1px 2px rgb(0 0 0 / .35) |
| `--bayangan-2` | 0 12px 28px rgb(31 41 55 / .14) | 0 12px 28px rgb(0 0 0 / .45) |
| `--fokus` | #1d4ed8 | #8ab4ff |
| `--fokus-lebar` | 3px | — |
| `--overlay-1` | rgb(0 0 0 / .55) | — |
| `--overlay-2` | rgb(0 0 0 / .68) | — |
| `--overlay-blur` | 4px | — |
| `--ukuran-sentuh` | 44px | — |

### SEMANTIK

| Token | Light | Dark |
|---|---|---|
| `--latar` | var(--kertas-50) | — |
| `--permukaan` | var(--putih) | — |
| `--permukaan-2` | var(--kertas-100) | — |
| `--teks` | var(--tinta-900) | — |
| `--teks-lembut` | var(--tinta-600) | — |
| `--garis` | #d9d2bd | #354a40 |
| `--garis-kuat` | #b4ab92 | #5a7466 |
| `--aksen` | var(--hijau-700) | — |
| `--aksen-tua` | var(--hijau-800) | — |
| `--aksen-lembut` | var(--hijau-100) | — |
| `--di-atas-aksen` | #ffffff | var(--putih) |
| `--sorot` | var(--kuning-500) | — |
| `--sorot-teks` | #2a1f00 | #1a1405 |
| `--info` | var(--biru-700) | — |
| `--info-lembut` | var(--biru-100) | — |
| `--bahaya` | var(--merah-700) | — |
| `--bahaya-lembut` | var(--merah-100) | — |

### KOMPONEN

| Token | Light | Dark |
|---|---|---|
| `--ukuran-ikon-kontak` | 46px | — |
| `--radius-kartu` | var(--radius-3) | — |
| `--radius-tombol` | var(--radius-pill) | — |

### NAVBAR & FOOTER modern

| Token | Light | Dark |
|---|---|---|
| `--forest` | #14532d | #7cb342 |
| `--primary-hijau` | #2e7d32 | #9ccc65 |
| `--light-hijau` | #dcf3c6 | #243b31 |
| `--sage` | #a7c840 | — |
| `--dark-teks` | #14532d | #f1f5f0 |
| `--header-kaca` | rgb(251 246 236 / .92) | rgb(16 28 24 / .92) |
| `--nav-teks` | var(--dark-teks) | #f1f5f0 |
| `--footer-bg` | #14532d | — |
| `--footer-teks` | #f6efdc | — |
| `--footer-lembut` | #c3d6bb | — |

## Aturan pemakaian bentuk

| Elemen | Radius | Alasan |
|---|---|---|
| CTA utama, tombol Masuk/Kirim | --radius-tombol (pill) | Tindakan utama |
| Badge data contoh, label status | pill | Informasi status |
| Navigasi, profil, tombol kontrol, detail | --radius-3 (12px) | Kontrol struktural |
| Input, kartu, tabel | --radius-2 / --radius-kartu | Permukaan konten |
| Avatar, toggle tema, ikon sosial | 50% | Lingkaran disengaja |

## Catatan pemeliharaan

- `--putih` bukan lagi putih murni: nilai light-nya #f6efdc (permukaan/kartu krem). Untuk teks di atas aksen pakai `--di-atas-aksen`.
- Palet merek: krem (#fbf6ec/#f6efdc), hijau (#2e7d32/#14532d), kuning sorot (#fcd34d). Logo tetap #82ce4a dan #2b6b2b.
- Mode gelap mempertahankan latar #101c18, permukaan #1c3028/#162720, dengan aksen hijau terang #9ccc65/#7cb342.
- `meta theme-color` memakai #FBF6EC (terang) dan #101c18 (gelap), mengikuti latar halaman; disinkronkan oleh `js/tema.js`.
- Modal video mengikuti tema (permukaan + teks + kontrol memakai token), kanvas pemutar tetap gelap `var(--video-bg)` agar video mudah dilihat.
- Tabel lama (setoran, riwayat, buku tabungan, harga) berubah menjadi kartu bertumpuk pada lebar ≤ 640 px, sehingga tidak ada geser horizontal di ponsel.
- Grafik dashboard memakai `--grafik-1`..`--grafik-5` (light #2e7d32/#8a9b4f/#b98a3c/#4a748c/#5f9d8c, gelap #7ac9a0/#b5c46a/#d9ac5c/#7fa9c2/#86c4b1); donat memakai warna token semantik.
- Dua token warisan (--utama, --sekunder) tidak terpakai; aman dihapus setelah audit lanjutan.
- Perubahan bentuk Phase 2 memakai token di atas; tidak ada nilai radius literal baru.
- Sebelum menambah border baru, gunakan token surface (--permukaan, --permukaan-2).
- Uji ulang kontras minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar/UI.
