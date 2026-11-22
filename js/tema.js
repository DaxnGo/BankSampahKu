// File   : js/tema.js
// Tujuan : Tombol mode gelap/terang yang tersimpan di browser.
// Catatan: Tombol ditulis statis di HTML; skrip ini hanya mengikat perilakunya.
//          Tanpa JS tombol tetap tampil, tetapi tidak berfungsi.

(function () {
  "use strict";

  var KUNCI = "banksampahku.tema";
  var META = { terang: "#F4F6F0", gelap: "#101c18" };

  function bacaPilihan() {
    try {
      return localStorage.getItem(KUNCI);
    } catch (galat) {
      return null;
    }
  }

  function simpanPilihan(nilai) {
    try {
      localStorage.setItem(KUNCI, nilai);
    } catch (galat) {
      // Abaikan bila penyimpanan tidak tersedia.
    }
  }

  function tombolTema() {
    return document.querySelectorAll(".tombol-tema");
  }

  function terapkan(tema) {
    var gelap = tema === "gelap";

    document.documentElement.setAttribute("data-tema", gelap ? "gelap" : "terang");

    var metaWarna = document.getElementById("warna-tema");
    if (metaWarna) metaWarna.setAttribute("content", gelap ? META.gelap : META.terang);

    Array.prototype.forEach.call(tombolTema(), function (tombol) {
      // Ikon bulan/matahari di dalam tombol diatur oleh CSS dari data-tema.
      tombol.setAttribute("aria-label", gelap ? "Gunakan mode terang" : "Gunakan mode gelap");
      tombol.setAttribute("aria-pressed", gelap ? "true" : "false");
      tombol.title = gelap ? "Mode terang" : "Mode gelap";
    });
  }

  function temaAwal() {
    var tersimpan = bacaPilihan();
    if (tersimpan === "gelap" || tersimpan === "terang") return tersimpan;
    var sistemGelap =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return sistemGelap ? "gelap" : "terang";
  }

  function ganti() {
    var berikut =
      document.documentElement.getAttribute("data-tema") === "gelap" ? "terang" : "gelap";
    terapkan(berikut);
    simpanPilihan(berikut);
  }

  terapkan(temaAwal());

  function init() {
    Array.prototype.forEach.call(tombolTema(), function (tombol) {
      tombol.addEventListener("click", ganti);
    });
    // Sinkronkan label/ikon dengan tema yang sedang aktif.
    terapkan(document.documentElement.getAttribute("data-tema") || "terang");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
