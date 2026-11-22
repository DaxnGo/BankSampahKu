// File   : js/auth.js
// Tujuan : Sesi login demo, pengaman halaman, dan penyesuaian navigasi.
// Catatan: Memakai localStorage melalui js/data.js. Bukan autentikasi aman.

(function () {
  "use strict";
  function setHidden(el, nilai) {
    if (!el) return;
    if (nilai) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }


  var Data = window.BankData;
  var identitasAktif = null;

  function identitas() {
    if (identitasAktif) return identitasAktif;
    var aktif = sesi();
    identitasAktif = aktif ? aktif.user : null;
    return identitasAktif;
  }

  function sesi() {
    return Data ? Data.ambilSesi() : null;
  }

  function masuk(username, password) {
    var user = Data.cariUser(username, password);
    if (!user) {
      return { ok: false, pesan: "Username atau kata sandi salah." };
    }
    Data.simpanSesi(user.id);
    return { ok: true, user: user };
  }

  function keluar() {
    Data.hapusSesi();
    identitasAktif = null;
  }

  function tujuanAwal(peran) {
    return peran === "petugas" ? "dashboard.html" : "dasbor-saya.html";
  }

  function butuh(peran, halamanIni) {
    var aktif = sesi();
    var halaman = halamanIni || window.location.pathname.split("/").pop();
    if (!aktif) {
      window.location.replace("login.html?lanjut=" + encodeURIComponent(halaman));
      return false;
    }
    if (peran && aktif.user.peran !== peran) {
      window.location.replace(tujuanAwal(aktif.user.peran));
      return false;
    }
    return true;
  }

  function konfirmasiKeluar() {
    var dialog = document.getElementById("logout-dialog");
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }
    keluar();
    window.location.replace("index.html");
  }

  function pasangTombolKeluar(tombol) {
    tombol.addEventListener("click", konfirmasiKeluar);
  }

  function isiTeks(wadah, pemilih, nilai) {
    var el = wadah.querySelector(pemilih);
    if (el) el.textContent = nilai;
  }

  function pasangDropdown(wadah) {
    if (!wadah || wadah.dataset.dropdownSiap) return;
    var dropdown = wadah.querySelector(".pengguna-dropdown");
    var trigger = wadah.querySelector("[data-profil-trigger]") || wadah.querySelector(".pengguna-pil");
    var panah = wadah.querySelector(".pengguna-panah");
    if (!dropdown || !trigger) return;
    wadah.dataset.dropdownSiap = "1";

    function atur(buka) {
      dropdown.hidden = !buka;
      trigger.setAttribute("aria-expanded", buka ? "true" : "false");
      if (panah && panah !== trigger) panah.setAttribute("aria-expanded", buka ? "true" : "false");
    }

    function balik(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      atur(dropdown.hidden);
    }

    trigger.addEventListener("click", balik);
    if (panah && panah !== trigger) panah.addEventListener("click", balik);

    document.addEventListener("click", function (e) {
      if (!wadah.contains(e.target)) atur(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dropdown.hidden) {
        e.preventDefault();
        atur(false);
        trigger.focus();
      }
    });
  }

  function perbaruiNavigasi() {
    var tautan = document.querySelectorAll("[data-nav-auth], [data-buka-login], [data-profil-trigger]");
    var pengguna = identitas();
    if (!tautan.length || !pengguna) return;
    var halamanIni = window.location.pathname.split("/").pop();

    Array.prototype.forEach.call(tautan, function (link) {
      var wadah = link.closest(".pengguna-wadah") || link.parentNode;
      var nama = link.querySelector("[data-teks-pengguna]") || link;

      nama.textContent = "Halo, " + pengguna.nama.split(" ")[0];
      if (link.hasAttribute("href")) link.setAttribute("href", tujuanAwal(pengguna.peran));
      link.classList.remove("active");
      if (halamanIni !== "login.html") link.removeAttribute("aria-current");
      link.setAttribute("data-aktif", "true");

      isiTeks(wadah, "[data-avatar]", Data.inisialNama(pengguna.nama));
      isiTeks(wadah, "[data-nama-pengguna]", pengguna.nama);
      isiTeks(wadah, "[data-peran-pengguna]",
        pengguna.peran === "petugas" ? "Petugas bank sampah" : "Warga / RT " + (pengguna.rt || "-"));
      isiTeks(wadah, "[data-kode-pengguna]",
        pengguna.peran === "petugas" ? "Akses seluruh pos" :
          (pengguna.kode ? "Kode penabung " + pengguna.kode : "RT " + (pengguna.rt || "-")));

      var menu = wadah.querySelector("[data-menu-pengguna]");
      if (menu) {
        var tujuan = pengguna.peran === "petugas"
          ? ["Input Setoran", "setoran.html"]
          : ["Dashboard Saya", "dasbor-saya.html"];
        menu.textContent = tujuan[0];
        menu.setAttribute("href", tujuan[1]);
        // Penanda halaman aktif sudah ada di sidebar; jangan duplikat di dropdown.
        menu.removeAttribute("aria-current");
      }

      pasangDropdown(wadah);
    });
  }

  function initHamburger() {
    var tombol = document.querySelector(".nav-hamburger");
    var nav = document.getElementById("menu-utama");
    if (!tombol || !nav) return;

    function tutup() {
      document.body.classList.remove("menu-terbuka");
      tombol.setAttribute("aria-expanded", "false");
      var buka = tombol.querySelector(".nav-hamburger-tutup");
      var ikon = tombol.querySelector("svg");
      if (buka) buka.hidden = true;
      setHidden(ikon, false);
    }

    tombol.addEventListener("click", function (e) {
      e.stopPropagation();
      var akanBuka = !document.body.classList.contains("menu-terbuka");
      document.body.classList.toggle("menu-terbuka", akanBuka);
      tombol.setAttribute("aria-expanded", akanBuka ? "true" : "false");
      var buka = tombol.querySelector(".nav-hamburger-tutup");
      var ikon = tombol.querySelector("svg");
      if (buka) buka.hidden = !akanBuka;
      setHidden(ikon, akanBuka);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-terbuka")) {
        tutup();
        tombol.focus();
      }
    });
  }

  function initKeAtas() {
    var tombol = document.getElementById("back-to-top");
    if (!tombol) return;

    function perbarui() {
      var tampil = (window.scrollY || window.pageYOffset || 0) > 300;
      tombol.classList.toggle("tampil", tampil);
      if (tampil) {
        tombol.removeAttribute("tabindex");
      } else {
        tombol.setAttribute("tabindex", "-1");
      }
    }

    window.addEventListener("scroll", perbarui, { passive: true });
    perbarui();

    tombol.addEventListener("click", function () {
      var kurangi = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: kurangi ? "auto" : "smooth" });
    });
  }

  function initDashboard() {
    var shell = document.querySelector(".app-shell");
    if (!shell) return;
    var pengguna = identitas();
    if (!pengguna) return;
    isiTeks(document, "[data-header-nama]", pengguna.nama);
    isiTeks(document, "[data-header-peran]",
      pengguna.peran === "petugas" ? "Petugas bank sampah" : "Warga / RT " + (pengguna.rt || "-"));

    var judul = document.querySelector("[data-header-judul]");
    if (judul) judul.textContent = (document.title || "").split(" | ")[0];

    var halamanIni = window.location.pathname.split("/").pop();
    var halamanBerperan = document.body.dataset.halaman || "";
    if (pengguna.peran === "petugas" && halamanBerperan.indexOf("akun:") === 0) {
      var menuAkun = document.querySelectorAll(".sidebar-nav > .sidebar-item");
      if (menuAkun.length >= 5) {
        var ringkasan = menuAkun[0];
        var setoran = menuAkun[1];
        var buku = menuAkun[2];
        ringkasan.setAttribute("href", "dashboard.html");
        setoran.setAttribute("href", "setoran.html");
        var ringkasanLabel = ringkasan.querySelector("span:last-child");
        var setoranLabel = setoran.querySelector("span:last-child");
        if (ringkasanLabel) ringkasanLabel.textContent = "Ringkasan";
        if (setoranLabel) setoranLabel.textContent = "Input Setoran";
        buku.remove();
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll(".sidebar-item"), function (item) {
      item.removeAttribute("aria-current");
      if ((item.getAttribute("href") || "").split("#")[0] === halamanIni) {
        item.setAttribute("aria-current", "page");
      }
    });

    var tombol = document.querySelector(".app-toggle");
    if (tombol) {
      var sidebar = document.getElementById("sidebar-app") || document.querySelector(".app-sidebar");
      function tutupSidebar() {
        document.body.classList.remove("sidebar-buka");
        tombol.setAttribute("aria-expanded", "false");
      }
      tombol.addEventListener("click", function (e) {
        e.stopPropagation();
        var buka = !document.body.classList.contains("sidebar-buka");
        document.body.classList.toggle("sidebar-buka", buka);
        tombol.setAttribute("aria-expanded", buka ? "true" : "false");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && document.body.classList.contains("sidebar-buka")) {
          tutupSidebar();
          tombol.focus();
        }
      });
      // Ketuk di luar laci (termasuk tirai) untuk menutup.
      document.addEventListener("click", function (e) {
        if (!document.body.classList.contains("sidebar-buka")) return;
        if (sidebar && sidebar.contains(e.target)) return;
        if (tombol.contains(e.target)) return;
        tutupSidebar();
      });
    }
  }

  function initLogoutDialog() {
    var dialog = document.getElementById("logout-dialog");
    if (!dialog) return;
    var batal = dialog.querySelector("[data-logout-batal]");
    var konfirmasi = dialog.querySelector("[data-logout-konfirmasi]");
    if (batal) batal.addEventListener("click", function () { dialog.close(); });
    if (konfirmasi) {
      konfirmasi.addEventListener("click", function () {
        keluar();
        window.location.replace("index.html");
      });
    }
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  function init() {
    if (document.body && document.body.dataset && document.body.dataset.halaman) {
      var bagian = document.body.dataset.halaman.split(":");
      if (bagian[0] === "petugas" && bagian[1]) {
        butuh("petugas", bagian[1]);
      } else if (bagian[0] === "warga" && bagian[1]) {
        butuh("warga", bagian[1]);
      } else if (bagian[0] === "akun" && bagian[1]) {
        butuh(null, bagian[1]);
      }
    }
    perbaruiNavigasi();
    Array.prototype.forEach.call(document.querySelectorAll("[data-keluar]"), pasangTombolKeluar);
    initHamburger();
    initKeAtas();
    initDashboard();
    initLogoutDialog();
  }

  window.BankAuth = {
    sesi: sesi,
    masuk: masuk,
    keluar: keluar,
    butuh: butuh,
    perbaruiNavigasi: perbaruiNavigasi
  };

  window.addEventListener("pageshow", function (e) {
    var privat = document.body && document.body.dataset && document.body.dataset.layout === "dashboard";
    if (privat && e.persisted && !sesi()) {
      window.location.replace("login.html?lanjut=" +
        encodeURIComponent(window.location.pathname.split("/").pop()));
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
