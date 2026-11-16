// File   : js/auth.js
// Tujuan : Sesi login demo, pengaman halaman, dan penyesuaian navigasi.
// Catatan: Memakai localStorage melalui js/data.js. Bukan autentikasi aman.

(function () {
  "use strict";

  var Data = window.BankData;

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

  function buatElemen(tag, teks, kelas) {
    var el = document.createElement(tag);
    if (teks) el.textContent = teks;
    if (kelas) el.className = kelas;
    return el;
  }

  function tambahItemSetelah(item, tag, teks, kelas, atribut) {
    var pembungkus = document.createElement("li");
    var el = buatElemen(tag, teks, kelas);
    if (atribut) {
      Object.keys(atribut).forEach(function (kunci) {
        el.setAttribute(kunci, atribut[kunci]);
      });
    }
    pembungkus.appendChild(el);
    item.parentNode.insertBefore(pembungkus, item.nextSibling);
    return el;
  }

  function pasangTombolKeluar(tombol) {
    tombol.addEventListener("click", function () {
      keluar();
      window.location.href = "index.html";
    });
  }

  function perbaruiNavigasi() {
    var tautan = document.querySelectorAll("[data-nav-auth]");
    var aktif = sesi();
    if (!tautan.length || !aktif) return;

    var namaDepan = aktif.user.nama.split(" ")[0];
    Array.prototype.forEach.call(tautan, function (link) {
      link.textContent = "Halo, " + namaDepan;
      link.setAttribute("href", tujuanAwal(aktif.user.peran));
      link.classList.add("nav-pengguna");
      link.removeAttribute("data-nav-auth");
      link.parentNode.insertBefore(link, link.parentNode.firstChild);

      if (link.closest(".main-nav")) {
        if (aktif.user.peran === "petugas") {
          tambahItemSetelah(link.parentNode, "a", "Input Setoran", "", {
            href: "setoran.html"
          });
        } else {
          tambahItemSetelah(link.parentNode, "a", "Dashboard Saya", "", {
            href: "dasbor-saya.html"
          });
        }
        var tombol = tambahItemSetelah(
          link.parentNode,
          "button",
          "Keluar",
          "nav-keluar",
          { type: "button" }
        );
        pasangTombolKeluar(tombol);
      }
    });
  }

  function init() {
    if (document.body && document.body.dataset && document.body.dataset.halaman) {
      var bagian = document.body.dataset.halaman.split(":");
      if (bagian[0] === "petugas" && bagian[1]) {
        butuh("petugas", bagian[1]);
      } else if (bagian[0] === "warga" && bagian[1]) {
        butuh("warga", bagian[1]);
      }
    }
    perbaruiNavigasi();
  }

  window.BankAuth = {
    sesi: sesi,
    masuk: masuk,
    keluar: keluar,
    butuh: butuh,
    perbaruiNavigasi: perbaruiNavigasi
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
