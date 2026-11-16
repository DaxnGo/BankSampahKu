// File   : js/login.js
// Tujuan : Menangani formulir masuk dan tombol akun contoh.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-login");
    if (!form) return;

    var kolomUsername = document.getElementById("username");
    var kolomPassword = document.getElementById("password");
    var kotakPesan = document.getElementById("pesan-login");
    var tombolReset = document.getElementById("reset-data");

    function tampilkanPesan(pesan, keadaan) {
      kotakPesan.textContent = pesan;
      kotakPesan.dataset.keadaan = keadaan || "salah";
    }

    var parameterAwal = new URLSearchParams(window.location.search);
    if (parameterAwal.get("lanjut")) {
      tampilkanPesan("Masuk terlebih dahulu untuk membuka halaman tersebut.", "info");
    }

    Array.prototype.forEach.call(document.querySelectorAll(".demo-akun"), function (tombol) {
      tombol.addEventListener("click", function () {
        kolomUsername.value = tombol.dataset.username;
        kolomPassword.value = tombol.dataset.password;
        tampilkanPesan("", "kosong");
        kolomUsername.focus();
      });
    });

    form.addEventListener("submit", function (acara) {
      acara.preventDefault();
      if (!kolomUsername.value.trim() || !kolomPassword.value) {
        tampilkanPesan("Isi username dan kata sandi terlebih dahulu.");
        return;
      }

      var hasil = window.BankAuth.masuk(kolomUsername.value, kolomPassword.value);
      if (!hasil.ok) {
        tampilkanPesan(hasil.pesan);
        return;
      }

      var parameter = new URLSearchParams(window.location.search);
      var lanjutan = parameter.get("lanjut");
      var tujuan = lanjutan && /^[\w.-]+\.html$/.test(lanjutan)
        ? lanjutan
        : (hasil.user.peran === "petugas" ? "dashboard.html" : "dasbor-saya.html");
      window.location.href = tujuan;
    });

    [kolomUsername, kolomPassword].forEach(function (kolom) {
      kolom.addEventListener("input", function () {
        if (kotakPesan.dataset.keadaan === "salah") {
          kotakPesan.textContent = "";
          kotakPesan.removeAttribute("data-keadaan");
        }
      });
    });

    if (tombolReset) {
      tombolReset.addEventListener("click", function () {
        var setuju = window.confirm("Kembalikan seluruh akun dan setoran ke data contoh awal?");
        if (!setuju) return;
        window.BankData.resetData();
        window.BankAuth.keluar();
        tampilkanPesan("Data contoh awal dipulihkan.", "ok");
      });
    }
  });
})();
