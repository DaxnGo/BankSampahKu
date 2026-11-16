// File   : js/animasi.js
// Tujuan : Animasi GSAP + ScrollTrigger untuk seluruh halaman.
// Catatan: Halaman tetap terbaca tanpa berkas ini. Semua animasi baru
//          dijalankan setelah GSAP berhasil dimuat, dan otomatis dilewati
//          bila pengguna mengaktifkan "kurangi gerak" di perangkatnya.

(function () {
  "use strict";

  // Tanpa GSAP, tanpa ScrollTrigger, atau pengguna minta gerak dikurangi:
  // biarkan halaman tampil apa adanya.
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);
  // UI cepat; hero dan galeri memakai durasi lebih panjang secara eksplisit.
  gsap.defaults({ ease: "power3.out", duration: 0.2 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  var MULAI = "top 90%";

  function tampil(el, opsi) {
    var o = opsi || {};
    gsap.from(el, {
      opacity: 0,
      y: o.y === undefined ? 26 : o.y,
      duration: o.durasi || 0.2,
      delay: o.jeda || 0,
      clearProps: "transform",
      scrollTrigger: {
        trigger: el,
        start: o.mulai || MULAI,
        // Muncul tiap kali masuk layar, memudar lagi saat keluar,
        // sehingga animasi terulang baik saat digulir naik maupun turun.
        toggleActions: "restart reverse restart reverse"
      }
    });
  }

  function tampilAnak(wadah, opsi) {
    var o = opsi || {};
    var anak = gsap.utils.toArray(wadah.children);
    if (!anak.length) return;
    gsap.from(anak, {
      opacity: 0,
      y: o.y === undefined ? 28 : o.y,
      duration: o.durasi || 0.2,
      stagger: o.jeda || 0.09,
      clearProps: "transform",
      scrollTrigger: {
        trigger: wadah,
        start: o.mulai || MULAI,
        toggleActions: "restart reverse restart reverse"
      }
    });
  }

  try {
    // ---- 1. Saat halaman dibuka ------------------------------------
    var header = document.querySelector(".site-header");
    if (header) {
      gsap.from(header, { opacity: 0, y: -14, duration: 0.2, clearProps: "transform" });
    }

    // Hero teks (Beranda, Cara Memilah, Harga Sampah).
    var heroIsi = document.querySelector(".hero-isi");
    if (heroIsi) {
      gsap.from(heroIsi.children, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.08,
        delay: 0.08,
        clearProps: "transform"
      });
    }

    // Hero foto (Kontak): gambar masuk dengan sedikit zoom-out.
    var banner = document.querySelector(".contact-hero .hero-banner-img");
    if (banner) {
      gsap.from(banner, {
        opacity: 0,
        scale: 1.06,
        duration: 1.1,
        ease: "power2.out",
        clearProps: "transform"
      });
    }

    // Kepala halaman Dashboard tidak punya hero, jadi muncul berurutan.
    var dashKepala = document.querySelector(".dash-kepala");
    if (dashKepala) {
      gsap.from(dashKepala.children, {
        opacity: 0,
        y: 26,
        duration: 0.2,
        stagger: 0.04,
        delay: 0.08,
        clearProps: "transform"
      });
    }

    // ---- 2. Saat digulir: judul dan pengantar bagian ----------------
    [
      ".home-judul-bagian",
      ".home-jelajah-heading",
      ".section-header",
      ".bagian > h2:not(.sr-only)",
      ".bagian > .bagian-pengantar"
    ].forEach(function (pemilih) {
      gsap.utils.toArray(pemilih).forEach(function (el) {
        tampil(el);
      });
    });

    // ---- 3. Saat digulir: blok konten ------------------------------
    [
      ".tips",
      ".form-card",
      ".map-card",
      ".tabel-bungkus",
      ".kalkulator",
      ".info-penting",
      ".dash-target",
      ".dash-tabel-bungkus"
    ].forEach(function (pemilih) {
      gsap.utils.toArray(pemilih).forEach(function (el) {
        tampil(el);
      });
    });

    // ---- 4. Saat digulir: kartu dan daftar muncul berurutan --------
    [
      { s: ".home-manfaat-grid", y: 30, jeda: 0.06 },
      { s: ".home-jelajah-grid", y: 26, jeda: 0.05 },
      { s: ".kartu-grid", y: 34, jeda: 0.06 },
      { s: ".langkah-daftar", y: 26, jeda: 0.05 },
      { s: ".contact-info-grid", y: 28, jeda: 0.06 },
      { s: ".gallery-grid", y: 26, jeda: 0.06 },
      { s: ".dash-batang-daftar", y: 22, jeda: 0.05 },
      { s: ".footer-grid", y: 22, jeda: 0.05 }
    ].forEach(function (aturan) {
      gsap.utils.toArray(aturan.s).forEach(function (wadah) {
        tampilAnak(wadah, aturan);
      });
    });

    // Foto galeri ikut membesar halus saat kartunya muncul.
    gsap.utils.toArray(".gallery-item img").forEach(function (gambar) {
      gsap.from(gambar, {
        scale: 1.08,
        duration: 1.2,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: gambar,
          start: MULAI,
          toggleActions: "restart reverse restart reverse"
        }
      });
    });

    // ---- 5. Indikator kemajuan gulir di bagian atas ------------------
    var bilah = document.createElement("div");
    bilah.className = "progress-gulir";
    bilah.setAttribute("aria-hidden", "true");
    var isiBilah = document.createElement("span");
    bilah.appendChild(isiBilah);
    document.body.appendChild(bilah);

    gsap.to(isiBilah, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
      }
    });

    // ---- 6. Segarkan posisi setelah semua aset selesai dimuat -------
    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    }
  } catch (galat) {
    // Bila ada yang gagal, jangan biarkan konten tetap tersembunyi.
    gsap.globalTimeline.clear();
    document.querySelectorAll("[style]").forEach(function (el) {
      el.style.removeProperty("opacity");
      el.style.removeProperty("visibility");
      el.style.removeProperty("transform");
    });
    if (window.console && console.warn) {
      console.warn("Animasi dilewati:", galat);
    }
  }
})();
