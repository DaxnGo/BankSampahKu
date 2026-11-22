# Laporan Redesign Full Page Login — BankSampahKu

Tanggal: 18 November 2026. Status: **FIXED & VERIFIED**.
Backup: `banksampahku-backup-gsap-20261118-0842` (diambil sebelum rangkaian perubahan halaman login).

## 1. Layout

- Tetap **full page**, bukan popup/modal. Tidak ada elemen `#login-modal` di `login.html`.
- Navbar minimal: logo di kiri, penanda halaman "Masuk", tombol **Kembali ke Beranda**, dan theme toggle di kanan.
- Kartu login terpusat, lebar maksimal 460 px, padding 24 px, radius 16 px, shadow lembut.
- Background off-white (light) / `#101C18` (dark) mengikuti token tema.

Tombol **Masuk** di navbar publik kini kembali mengarah ke `login.html`
(perilaku sesuai permintaan terbaru). Kode modal lama masih tersimpan tetapi tidak
lagi dipicu dari navbar.

## 2. Demo account collapsible

- Bagian demo tertutup secara default: `aria-expanded="false"`, panel `hidden`.
- Tombol **"Gunakan Akun Demo"** membuka/menutup panel dengan animasi 200 ms
  (`grid-template-rows` + opacity), panah berotasi 180°.
- Di dalam panel: kartu **Petugas** dan **Warga** berdampingan; klik mengisi form otomatis.
- Kredensial tidak diubah: `petugas/petugas123`, `warga/warga123`, serta `budi`, `rina`, `andi`.
- Klik di dalam panel tidak menutup modal; hanya tombol toggle yang mengubah state.

## 3. Reset demo data

- Tombol **"Kembalikan data contoh awal"** dihapus dari tampilan login.
- Dipindahkan ke `pengaturan.html` dalam baris tersembunyi `data-dev-only`.
- Hanya tampil jika `localStorage["banksampahku.dev"] === "1"`.
- Fungsi `BankData.resetData()` tetap dipanggil, lengkap dengan pesan status.

## 4. Animasi

- Kartu login fade-up 260 ms via GSAP dari `js/animasi.js` (menghormati reduced motion).
- Expand/collapse demo 200 ms, hover/active dan focus transition 150 ms.
- Theme transition 180 ms, tanpa perubahan ukuran header.

## 5. Verifikasi

| Pengujian | Hasil |
|---|---|
| Navbar publik "Masuk" → `login.html` | Lolos (bukan modal) |
| Kartu di tengah, form penuh terlihat | Lolos |
| Demo tertutup saat pertama dibuka | Lolos |
| Buka/tutup demo + autofill Petugas/Warga | Lolos |
| Show/Hide password | Lolos |
| Login invalid → pesan error | Lolos |
| Login valid → `dasbor-saya.html`, sesi tersimpan | Lolos |
| Reset tersembunyi untuk pengguna biasa | Lolos |
| Light/Dark | Lolos |
| 234 konfigurasi (13 halaman × 9 lebar × 2 tema) | 0 masalah |
| Console/network 13 halaman | 0 error |

### Desktop (tanpa vertical scroll)
| Resolusi | scrollHeight | viewport |
|---|---:|---:|
| 1920×1080 | 1080 | 1080 |
| 1440×900 | 900 | 900 |
| 1366×768 | 768 | 768 |
| 1280×720 | 720 | 720 |

Tinggi kartu 446 px, lebar 460 px, `scrollX = 0`.

### Mobile
390×844: kartu 438 px, scroll vertical masih tersedia (diizinkan), tanpa overflow horizontal.

## 6. File berubah

- `login.html` — navbar minimal, demo collapsible, reset dihapus.
- `pengaturan.html` — reset demo di area pengembang + pesan status.
- `index.html`, `memilah.html`, `harga.html`, `kontak.html` — "Masuk" kembali ke halaman penuh.
- `css/style.css` — layout login, collapsible, dev-only.
- `js/login.js` — logika expand/collapse.
- `js/pengaturan.js` — reset + dev mode.
- `js/animasi.js` — fade-in kartu login.

## 7. Catatan

- Tes lama yang melaporkan `popup: true` pada halaman login adalah false positive: elemen `#login-modal` memang tidak ada, sehingga pembacaan `.hidden` menghasilkan `undefined`.
- Modal login lama tetap ada di halaman publik sebagai berkas, tetapi tidak lagi dipicu dari navbar sesuai arahan terbaru.

## 8. NOT TESTED

- Perangkat sentuh fisik dan pembaca layar nyata.
