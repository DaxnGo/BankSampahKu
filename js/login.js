// File   : js/login.js
// Tujuan : Menangani formulir masuk, validasi, state loading, dan akun contoh.

(function () {
  "use strict";
  function setHidden(el, nilai) {
    if (!el) return;
    if (nilai) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }


  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-login");
    if (!form) return;

    var kolomUsername = document.getElementById("username");
    var kolomPassword = document.getElementById("password");
    var kotakPesan = document.getElementById("pesan-login");
    var tombolMasuk = document.getElementById("login-submit");
    var tombolMata = document.getElementById("lihat-password");
    var tombolReset = document.getElementById("reset-data");

    function pesan(teks, keadaan) {
      if (!kotakPesan) return;
      kotakPesan.textContent = teks;
      if (keadaan) kotakPesan.dataset.keadaan = keadaan;
      else kotakPesan.removeAttribute("data-keadaan");
    }

    function memuat(aktif) {
      if (!tombolMasuk) return;
      tombolMasuk.disabled = aktif;
      tombolMasuk.classList.toggle("sedang-muat", aktif);
      var teks = tombolMasuk.querySelector(".login-teks");
      if (teks) teks.textContent = aktif ? "Memproses..." : "Masuk";
      if (kolomUsername) kolomUsername.disabled = aktif;
      if (kolomPassword) kolomPassword.disabled = aktif;
    }

    var parameterAwal = new URLSearchParams(window.location.search);
    if (parameterAwal.get("lanjut")) {
      pesan("Masuk terlebih dahulu untuk membuka halaman tersebut.", "info");
    }

    if (tombolMata && kolomPassword) {
      tombolMata.addEventListener("click", function () {
        var tampil = kolomPassword.type === "password";
        kolomPassword.type = tampil ? "text" : "password";
        tombolMata.setAttribute("aria-label", tampil ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
        tombolMata.setAttribute("aria-pressed", tampil ? "true" : "false");
        tombolMata.title = tampil ? "Sembunyikan kata sandi" : "Tampilkan kata sandi";
        var buka = tombolMata.querySelector(".login-mata-buka");
        var tutup = tombolMata.querySelector(".login-mata-tutup");
        setHidden(buka, tampil);
        setHidden(tutup, !tampil);
      });
    }

    var demoToggle = document.getElementById("demo-toggle");
    var demoPanel = document.getElementById("demo-panel");
    if (demoToggle && demoPanel) {
      var timerDemo = null;
      demoToggle.addEventListener("click", function () {
        var akanBuka = demoToggle.getAttribute("aria-expanded") !== "true";
        demoToggle.setAttribute("aria-expanded", akanBuka ? "true" : "false");
        if (akanBuka) {
          if (timerDemo) { clearTimeout(timerDemo); timerDemo = null; }
          demoPanel.hidden = false;
          requestAnimationFrame(function () { demoPanel.classList.add("terbuka"); });
        } else {
          demoPanel.classList.remove("terbuka");
          timerDemo = setTimeout(function () {
            demoPanel.hidden = true;
            timerDemo = null;
          }, 200);
        }
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll(".demo-akun, .demo-chip"), function (tombol) {
      tombol.addEventListener("click", function () {
        kolomUsername.value = tombol.dataset.username;
        kolomPassword.value = tombol.dataset.password;
        pesan("", "");
        kolomUsername.focus();
      });
    });

    form.addEventListener("submit", function (acara) {
      acara.preventDefault();

      var username = (kolomUsername.value || "").trim();
      var password = kolomPassword.value || "";

      if (!username || !password) {
        pesan("Isi username atau email dan kata sandi terlebih dahulu.", "salah");
        (!username ? kolomUsername : kolomPassword).focus();
        return;
      }

      pesan("", "");
      memuat(true);

      // Beri satu frame agar state loading sempat terlihat.
      window.setTimeout(function () {
        var hasil;
        try {
          hasil = window.BankAuth.masuk(username, password);
        } catch (galat) {
          hasil = { ok: false, pesan: "Layanan masuk sedang tidak tersedia." };
        }

        if (!hasil.ok) {
          memuat(false);
          pesan(hasil.pesan || "Username atau kata sandi salah.", "salah");
          kolomPassword.focus();
          return;
        }

        var parameter = new URLSearchParams(window.location.search);
        var lanjutan = parameter.get("lanjut");
        var tujuan = lanjutan && /^[\w.-]+\.html$/.test(lanjutan)
          ? lanjutan
          : (hasil.user.peran === "petugas" ? "dashboard.html" : "dasbor-saya.html");
        window.location.assign(tujuan);
      }, 250);
    });

    [kolomUsername, kolomPassword].forEach(function (kolom) {
      kolom.addEventListener("input", function () {
        if (kotakPesan && kotakPesan.dataset.keadaan === "salah") pesan("", "");
      });
    });

    if (tombolReset) {
      tombolReset.addEventListener("click", function () {
        if (window.BankData) window.BankData.resetData();
        pesan("Data contoh awal dikembalikan.", "info");
      });
    }
  });
})();
