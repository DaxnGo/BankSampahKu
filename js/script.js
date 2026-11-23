// File   : js/script.js
// Pemilik: Anggota 2
// Tujuan : Bonus: kalkulator saldo pada halaman Harga Sampah
// Catatan: Halaman tetap terbaca tanpa berkas ini; hanya kalkulator yang
//          butuh JavaScript. Harga diambil dari atribut value pada <option>.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-kalkulator");
  if (!form) return;

  const pilihanJenis = document.getElementById("jenis");
  const kolomBerat = document.getElementById("berat");
  const kotakHasil = document.getElementById("hasil-kalkulator");

  const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatBerat = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  });

  function bersihkanHasil() {
    kotakHasil.textContent = "";
    kotakHasil.removeAttribute("data-keadaan");
  }

  function tampilkanPesan(pesan, kolomBermasalah) {
    kotakHasil.replaceChildren();
    kotakHasil.dataset.keadaan = "salah";

    const teks = document.createElement("p");
    teks.textContent = pesan;
    kotakHasil.appendChild(teks);

    [pilihanJenis, kolomBerat].forEach(function (kolom) {
      if (kolom === kolomBermasalah) {
        kolom.setAttribute("aria-invalid", "true");
      } else {
        kolom.removeAttribute("aria-invalid");
      }
    });
    kolomBermasalah.focus();
  }

  function tampilkanHasil(total, berat, namaJenis, hargaPerKg) {
    kotakHasil.replaceChildren();
    kotakHasil.dataset.keadaan = "ok";
    pilihanJenis.removeAttribute("aria-invalid");
    kolomBerat.removeAttribute("aria-invalid");

    const keterangan = document.createElement("p");
    keterangan.className = "hasil-keterangan";
    keterangan.textContent = "Perkiraan saldo";

    const angka = document.createElement("p");
    angka.className = "hasil-angka";
    angka.textContent = formatRupiah.format(total);

    const rincian = document.createElement("p");
    rincian.className = "hasil-rincian";
    rincian.textContent =
      namaJenis +
      " " +
      formatBerat.format(berat) +
      " kg × " +
      formatRupiah.format(hargaPerKg) +
      "/kg (harga contoh)";

    kotakHasil.append(keterangan, angka, rincian);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const hargaPerKg = Number(pilihanJenis.value);
    const berat = Number(kolomBerat.value);

    if (!pilihanJenis.value || !Number.isFinite(hargaPerKg) || hargaPerKg <= 0) {
      tampilkanPesan("Pilih jenis sampah terlebih dahulu.", pilihanJenis);
      return;
    }

    if (!kolomBerat.validity.valid || !Number.isFinite(hargaPerKg * berat)) {
      tampilkanPesan("Masukkan berat minimal 0,1 kg dalam kelipatan 0,1 kg (misalnya 2,5 kg).", kolomBerat);
      return;
    }

    const namaJenis = pilihanJenis.options[pilihanJenis.selectedIndex].text;
    tampilkanHasil(hargaPerKg * berat, berat, namaJenis, hargaPerKg);
  });

  form.addEventListener("reset", function () {
    bersihkanHasil();
    pilihanJenis.removeAttribute("aria-invalid");
    kolomBerat.removeAttribute("aria-invalid");
  });

  [pilihanJenis, kolomBerat].forEach(function (kolom) {
    kolom.addEventListener("input", function () {
      kolom.removeAttribute("aria-invalid");
      bersihkanHasil();
    });
  });
});
