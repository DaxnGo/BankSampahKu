/* BankSampahKu - script.js (Anggota 2)
   Isi: (1) kalkulator saldo di harga.html, (2) mode gelap.
   Halaman tetap berfungsi tanpa file ini. */

(function () {
  "use strict";

  /* ---------- Util ---------- */
  var formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  });

  function simpan(kunci, nilai) {
    try { localStorage.setItem(kunci, nilai); } catch (e) { /* abaikan */ }
  }
  function baca(kunci) {
    try { return localStorage.getItem(kunci); } catch (e) { return null; }
  }

  /* ---------- 1. Kalkulator saldo ---------- */
  function mulaiKalkulator() {
    var form = document.getElementById("form-kalkulator");
    if (!form) { return; }

    var pilihJenis = document.getElementById("jenis");
    var inputBerat = document.getElementById("berat");
    var pesan = document.getElementById("kalkulator-pesan");
    var total = document.getElementById("kalkulator-total");

    function tampilkanPesan(teks) { pesan.textContent = teks; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tampilkanPesan("");

      var harga = parseFloat(pilihJenis.value);
      var berat = parseFloat(String(inputBerat.value).replace(",", "."));

      if (isNaN(harga)) {
        tampilkanPesan("Pilih jenis sampah terlebih dahulu.");
        pilihJenis.focus();
        return;
      }
      if (isNaN(berat) || berat <= 0) {
        tampilkanPesan("Isi berat sampah dengan angka lebih dari 0.");
        inputBerat.focus();
        return;
      }

      total.textContent = formatRupiah.format(Math.round(harga * berat));
    });

    form.addEventListener("reset", function () {
      tampilkanPesan("");
      total.textContent = formatRupiah.format(0);
    });
  }

  /* ---------- 2. Mode gelap ---------- */
  function mulaiModeGelap() {
    var akar = document.documentElement;
    var tersimpan = baca("tema");
    if (tersimpan === "gelap" || tersimpan === "terang") {
      akar.setAttribute("data-tema", tersimpan);
    }

    var tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "tombol-tema";

    function sedangGelap() {
      var atribut = akar.getAttribute("data-tema");
      if (atribut) { return atribut === "gelap"; }
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function segarkan() {
      var gelap = sedangGelap();
      tombol.textContent = gelap ? "☀️ Mode Terang" : "🌙 Mode Gelap";
      tombol.setAttribute("aria-pressed", gelap ? "true" : "false");
    }

    tombol.addEventListener("click", function () {
      var berikut = sedangGelap() ? "terang" : "gelap";
      akar.setAttribute("data-tema", berikut);
      simpan("tema", berikut);
      segarkan();
    });

    var tujuan = document.querySelector(".header-isi");
    if (tujuan) {
      tujuan.appendChild(tombol);
      segarkan();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    mulaiKalkulator();
    mulaiModeGelap();
  });
})();
