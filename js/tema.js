// File   : js/tema.js
// Tujuan : Tombol mode gelap/terang yang tersimpan di browser.
// Catatan: Mengikuti preferensi sistem bila belum ada pilihan tersimpan.

(function () {
  "use strict";

  var KUNCI = "banksampahku.tema";

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

  function terapkan(tema) {
    var gelap = tema === "gelap";
    document.documentElement.setAttribute("data-tema", gelap ? "gelap" : "terang");
    var metaWarna = document.getElementById("warna-tema");
    if (metaWarna) metaWarna.setAttribute("content", gelap ? "#111A12" : "#FBF6EC");
    var tombol = document.querySelector(".tombol-tema");
    if (!tombol) return;
    tombol.innerHTML = '<i class="ti ' + (gelap ? "ti-sun" : "ti-moon") + '" aria-hidden="true"></i>';
    tombol.setAttribute("aria-label", gelap ? "Gunakan mode terang" : "Gunakan mode gelap");
    tombol.setAttribute("aria-pressed", gelap ? "true" : "false");
    tombol.title = gelap ? "Mode terang" : "Mode gelap";
  }

  var sistemGelap = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  terapkan(bacaPilihan() || (sistemGelap ? "gelap" : "terang"));

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".main-nav ul");
    if (!nav) return;

    var item = document.createElement("li");
    var tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "tombol-tema";
    item.appendChild(tombol);
    nav.appendChild(item);

    tombol.addEventListener("click", function () {
      var berikut = document.documentElement.getAttribute("data-tema") === "gelap" ? "terang" : "gelap";
      terapkan(berikut);
      simpanPilihan(berikut);
    });

    terapkan(document.documentElement.getAttribute("data-tema") || "terang");
  });
})();
