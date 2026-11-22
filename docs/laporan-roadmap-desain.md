# Laporan Implementasi Roadmap Desain — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.

Implementasi mengikuti tiga fase dari audit anti-slop. Backup sebelum perubahan:
`banksampahku-backup-roadmap-20261118-0703`.

## Phase 1 — Quick Wins

| Item | Status | Bukti |
|---|---|---|
| Hapus titik di heading `login.html` | FIXED & VERIFIED | `titik heading = 0` |
| Mikro-copy jadi satu kalimat | FIXED & VERIFIED | 7 kalimat dipendekan di index, dashboard, dasbor-saya, riwayat, buku, harga, login |
| Fallback teks `profil-nama` | FIXED & VERIFIED | `<h2 id="profil-nama">Nama penabung</h2>` |
| Kurangi satu eyebrow per halaman dashboard | FIXED & VERIFIED | 8 halaman dashboard kini masing-masing **1** `dash-eyebrow` |

Contoh perubahan copy:
- "Setiap setoran dicatat seperti buku tabungan: berat, saldo, dan statusnya. Contoh tampilan di bawah memakai data demo." → "Contoh buku tabungan nasabah (data demo)."
- "Kedua grafik memakai agregat dari penyimpanan browser. Tidak ada tren bulanan dan tidak ada bulan yang direkayasa." → "Grafik memakai data agregat yang tersimpan di browser."
- "Setoran terakhir sudah ditimbang dan diperiksa petugas. Catatan ini bukan bukti pembayaran resmi." → "Status setoran setelah penimbangan oleh petugas."

## Phase 2 — Structural Improvements

| Item | Status | Detail |
|---|---|---|
| Konsolidasi pill | FIXED & VERIFIED | 9 selector kontrol diubah ke `--radius-3` (12px): `.menu-item`, `.pengguna-pil`, `.tombol-ulang`, `.auth-reset`, `.tombol-hapus`, `.login-modal-tutup`, `.video-tutup`, `.back-to-top`, `.tombol-detail`. Pill tetap dipakai untuk CTA/status. Toggle tema, avatar, dan ikon sosial sengaja tetap lingkaran. |
| Kurangi border bersarang | FIXED & VERIFIED | `border-right` pada `.home-manfaat-ikon` dihapus; surface dibedakan dengan latar. |
| Ritme dashboard petugas | FIXED & VERIFIED | `[data-layout="dashboard"] main > section + section` diberi `margin-block-start: var(--sp-6)`; `.hal-kepala` diberi jeda bawah. |
| Overlay modal/dialog | FIXED & VERIFIED | Token baru `--overlay-1`, `--overlay-2`, `--overlay-blur`; dipakai video modal, login modal, dialog detail, dan dialog logout. |

## Phase 3 — Design Refinement

| Item | Status | Hasil |
|---|---|---|
| Uji ulang kontras | FIXED & VERIFIED | 16 konfigurasi (8 halaman × 2 tema), **0 elemen gagal** ambang WCAG 4.5:1 / 3:1 |
| Iterasi heading scale | FIXED & VERIFIED | `--teks-6`: `clamp(2rem, 4.2vw, 2.875rem)` (dulu `2.125rem … 3.25rem`) |
| Konsistensi light/dark | FIXED & VERIFIED | Latar terang `rgb(244,246,240)` dan gelap `rgb(16,28,24)` stabil di 144 konfigurasi |
| Responsive 375–1920 | FIXED & VERIFIED | 72 + 144 + 144 pengukuran: **0 overflow horizontal**, 0 elemen kunci hilang |
| Dokumentasi token | FIXED & VERIFIED | `docs/DESIGN-TOKENS.md` berisi token light/dark, aturan radius, dan prinsip pemeliharaan |

## Perbaikan tambahan yang ditemukan saat verifikasi

**FIXED & VERIFIED** — Ikon show/hide password tampil bertumpuk (terlihat seperti dua ikon mata saling menimpa).

Penyebab: JavaScript mengubah properti `.hidden` pada elemen `<svg>`. Properti IDL ini tidak didukung konsisten pada SVG, sehingga atribut `hidden` tidak pernah benar-benar diterapkan. Perbaikan:
- Fungsi `setHidden(el, nilai)` memakai `setAttribute`/`removeAttribute` di `login-modal.js`, `login.js`, `video-modal.js`, `pengaturan.js`, dan `auth.js`.
- CSS `.login-mata svg[hidden]`, `.vk-tombol svg[hidden]`, `.pengaturan-tema-tombol svg[hidden]`, `.nav-hamburger svg[hidden]` memaksa `display:none`.

Teruji: kondisi awal hanya ikon mata terbuka yang tampil; setelah klik hanya ikon mata tertutup yang tampil dan `type` input berubah `password → text`.

## File yang berubah

- HTML: `login.html`, `profil.html`, `index.html`, `dashboard.html`, `dasbor-saya.html`, `setoran.html`, `riwayat-setoran.html`, `buku-tabungan.html`, `harga-sampah.html`, `pengaturan.html`.
- CSS: `css/style.css` (token overlay, radius kontrol, ritme, heading scale, SVG hidden).
- JS: `js/login-modal.js`, `js/login.js`, `js/video-modal.js`, `js/pengaturan.js`, `js/auth.js`.
- Dokumen baru: `docs/DESIGN-TOKENS.md`, laporan ini.

## Verifikasi akhir

- CSS: 1 `:root`, kurung seimbang, 85 token terdefinisi / 83 terpakai, tanpa token undefined.
- JavaScript: seluruh file lolos `node --check`.
- 13 halaman: **0 galat JavaScript**.
- Console/network audit: 0 error, 0 aset gagal.

## NEEDS ATTENTION

- Dua token warisan `--utama` dan `--sekunder` masih tidak terpakai; aman dihapus setelah konfirmasi.
- Toggle tema, avatar, dan ikon sosial sengaja tetap berbentuk lingkaran karena merupakan keputusan desain eksplisit, bukan pill generik.

## NOT TESTED

- Pembaca layar (NVDA/VoiceOver) dan perangkat sentuh fisik.
