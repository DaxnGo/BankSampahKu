// Tampilkan reset data hanya saat mode pengembang aktif.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    try {
      if (localStorage.getItem("banksampahku.dev") !== "1") return;
    } catch (erro) {
      return;
    }

    var reset = document.getElementById("reset-data");
    var aviso = document.getElementById("pesan-reset");
    if (!reset || !aviso || !window.BankData) return;

    document.body.classList.add("dev-mode");
    reset.addEventListener("click", function () {
      if (!window.confirm("Kembalikan data contoh awal? Setoran demo yang ditambahkan akan terhapus.")) return;
      window.BankData.resetData();
      aviso.textContent = "Data contoh awal dikembalikan.";
    });
  });
})();
