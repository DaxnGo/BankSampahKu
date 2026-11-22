# Laporan Perbaikan Profile Dropdown & Konsistensi Identitas — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.
Backup: `banksampahku-backup-dropdown-profil-20261118-1026`.

## 1. Akar masalah

| Masalah | Penyebab |
|---|---|
| Klik profil memicu refresh/navigasi | `.pengguna-pil` adalah `<a href="dashboard.html" data-nav-auth>`; handler hanya `preventDefault()` pada layar ≤900 px, sehingga di desktop klik tersebut navigasi |
| Dropdown tidak langsung terbuka | Satu-satunya trigger adalah tombol panah `.pengguna-panah` yang terpisah dari area profil |
| Nama berubah-ubah | Klik berulang menyebabkan navigasi/reload; komponen dibaca ulang sehingga terkesan identitas berganti |
| Event listener ganda | Tidak ada penanda `dataset` yang andal pada komponen trigger lama; logika pencampuran link + panah menimbulkan dua jalur aksi |

Tidak ada `Math.random()`, array index acak, atau fallback nama yang berubah di kode —
masalahnya murni pada struktur trigger dan event routing.

## 2. Perbaikan struktural

- Di 8 halaman dashboard, tombol profil dijadikan **satu `<button type="button" data-profil-trigger>`**
  yang berisi ikon pengguna, teks "Halo, Nama", dan chevron. Tombol panah terpisah dihapus.
- Tidak ada `href`, tidak ada navigasi, tidak ada reload saat dropdown dibuka.
- `pasangDropdown()` kini memakai satu trigger dan satu state `dropdown.hidden`;
  `aria-expanded` diperbarui di trigger. Klik di dalam dropdown tidak menutup.
- `e.preventDefault()` + `e.stopPropagation()` hanya dipakai pada trigger, bukan secara global.
- Penanda `wadah.dataset.dropdownSiap` mencegah listener ganda.

## 3. Konsistensi identitas

- Fungsi baru `identitas()` cache data pengguna dari `Data.ambilSesi()` via `BankAuth`.
- `perbaruiNavigasi()` dan `initDashboard()` memakai sumber yang sama.
- `keluar()` mengosongkan cache identitas.
- Tidak ada penulisan data profil dari dropdown; dropdown hanya membaca.
- Informasi yang tampil: nama lengkap, peran, kode nasabah/RT (atau "Akses seluruh pos" untuk petugas).

## 4. Perilaku & visual

- Satu klik di area mana pun (ikon, teks, chevron) langsung membuka; klik lagi menutup.
- Klik di luar dan Escape menutup; fokus kembali ke tombol profil.
- Chevron berotasi 180° dengan transisi 150 ms; dropdown fade + translateY 4 px, 180 ms.
- z-index dropdown 110; tidak ada clipping/overflow.

## 5. Verifikasi browser

| Pengujian | Hasil |
|---|---|
| Klik area tombol profil (1 klik) | Dropdown terbuka, `aria-expanded=true`, marker `window.__marker` tetap ada → **tanpa reload** |
| Klik lagi | Dropdown tertutup |
| Klik ikon & chevron | Keduanya membuka dropdown (event bubbling benar) |
| 6 klik cepat | State benar, nama tetap "Budi Santoso", tidak ada listener ganda |
| Klik luar & Escape | Dropdown tertutup |
| Refresh & pindah 6 halaman dashboard | Nama, peran, kode identik: "Budi Santoso / Warga / Kode W-001" |
| Akun Petugas | "Petugas Bank Sampah / Halo, Petugas / Akses seluruh pos" |
| Logout & login ulang | Identitas sesuai akun baru |
| Light/Dark | Lolos |
| 234 konfigurasi (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error |

Catatan pengujian: `SVGElement` tidak memiliki method `.click()`; pengujian ikon memakai
`dispatchEvent(new MouseEvent("click",{bubbles:true}))`, setara dengan klik pengguna nyata.

## 6. File berubah

- 8 file HTML dashboard — trigger profil terpadu.
- `js/auth.js` — dropdown trigger, cache identitas, cleanup.
- `css/style.css` — rotasi chevron mengikuti `aria-expanded`.

## 7. NEEDS ATTENTION

- Autentikasi tetap berbasis `localStorage` demo; validasi role masih client-side (keterbatasan proyek yang sudah ada).

## 8. NOT TESTED

- Pembaca layar nyata dan perangkat sentuh fisik.
