// File   : js/login-modal.js
// Tujuan : Modal autentikasi di halaman publik memakai BankAuth yang sudah ada.

(function () {
  "use strict";
  function setHidden(el, nilai) {
    if (!el) return;
    if (nilai) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }


  var modal = document.getElementById("login-modal");
  if (!modal) return;

  var panel = modal.querySelector(".login-modal-panel");
  var overlay = modal.querySelector("[data-tutup-login]");
  var tombolTutup = document.getElementById("tutup-login");
  var form = document.getElementById("form-login-modal");
  var username = document.getElementById("modal-username");
  var password = document.getElementById("modal-password");
  var pesan = document.getElementById("pesan-login-modal");
  var submit = document.getElementById("login-modal-submit");
  var mata = modal.querySelector("[data-lihat-password]");
  var pemicuTerakhir = null;
  var sedangProses = false;
  var timerTutup = null;

  function sesiAda() {
    try { return !!localStorage.getItem("banksampahku.sesi.v1"); } catch (e) { return false; }
  }

  function tulisPesan(teks, keadaan) {
    if (!pesan) return;
    pesan.textContent = teks;
    if (keadaan) pesan.dataset.keadaan = keadaan;
    else pesan.removeAttribute("data-keadaan");
  }

  function memuat(aktif) {
    sedangProses = aktif;
    if (!submit) return;
    submit.disabled = aktif;
    submit.classList.toggle("sedang-muat", aktif);
    var teks = submit.querySelector(".login-teks");
    if (teks) teks.textContent = aktif ? "Memproses..." : "Masuk";
    if (username) username.disabled = aktif;
    if (password) password.disabled = aktif;
  }

  function buka(pemicu) {
    if (sesiAda()) {
      window.location.assign("dashboard.html");
      return;
    }
    if (timerTutup) { clearTimeout(timerTutup); timerTutup = null; }
    pemicuTerakhir = pemicu || document.activeElement;
    modal.hidden = false;
    document.body.classList.add("login-terkunci");
    requestAnimationFrame(function () { modal.classList.add("sedang-buka"); });
    tulisPesan("", "");
    if (username) username.focus();
  }

  function tutup() {
    memuat(false);
    tulisPesan("", "");
    modal.classList.remove("sedang-buka");
    timerTutup = setTimeout(function () {
      modal.hidden = true;
      document.body.classList.remove("login-terkunci");
      timerTutup = null;
      if (pemicuTerakhir && typeof pemicuTerakhir.focus === "function") pemicuTerakhir.focus();
    }, 200);
  }

  function daftarFokus() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])'),
      function (el) { return !el.hidden && el.offsetParent !== null; }
    );
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-buka-login]"), function (tombol) {
    tombol.addEventListener("click", function () { buka(tombol); });
  });

  if (tombolTutup) tombolTutup.addEventListener("click", tutup);
  if (overlay) overlay.addEventListener("click", function (e) {
    if (!panel.contains(e.target)) tutup();
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (sedangProses) return;
    if (e.key === "Escape") { e.preventDefault(); tutup(); return; }
    if (e.key !== "Tab") return;
    var daftar = daftarFokus();
    if (!daftar.length) return;
    var pertama = daftar[0], terakhir = daftar[daftar.length - 1];
    if (e.shiftKey && document.activeElement === pertama) { e.preventDefault(); terakhir.focus(); }
    else if (!e.shiftKey && document.activeElement === terakhir) { e.preventDefault(); pertama.focus(); }
  });

  if (mata && password) {
    mata.addEventListener("click", function () {
      var tampil = password.type === "password";
      password.type = tampil ? "text" : "password";
      mata.setAttribute("aria-label", tampil ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
      mata.setAttribute("aria-pressed", tampil ? "true" : "false");
      var buka = mata.querySelector(".login-mata-buka");
      var tutupIkon = mata.querySelector(".login-mata-tutup");
      setHidden(buka, tampil);
      setHidden(tutupIkon, !tampil);
    });
  }

  [username, password].forEach(function (kolom) {
    if (!kolom) return;
    kolom.addEventListener("input", function () {
      if (pesan && pesan.dataset.keadaan === "salah") tulisPesan("", "");
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sedangProses) return;

      var u = (username.value || "").trim();
      var p = password.value || "";
      if (!u || !p) {
        tulisPesan("Isi username atau email dan kata sandi terlebih dahulu.", "salah");
        (!u ? username : password).focus();
        return;
      }

      tulisPesan("", "");
      memuat(true);
      setTimeout(function () {
        var hasil;
        try { hasil = window.BankAuth.masuk(u, p); }
        catch (galat) { hasil = { ok: false, pesan: "Layanan masuk sedang tidak tersedia." }; }

        if (!hasil.ok) {
          memuat(false);
          tulisPesan(hasil.pesan || "Username atau kata sandi salah.", "salah");
          password.focus();
          return;
        }
        var tujuan = hasil.user.peran === "petugas" ? "dashboard.html" : "dasbor-saya.html";
        window.location.assign(tujuan);
      }, 250);
    });
  }
})();
