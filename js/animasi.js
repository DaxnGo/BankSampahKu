// File   : js/animasi.js
// Tujuan : GSAP 3.15.1 + ScrollTrigger — motion yang purposefull dan tenang.
// Catatan : Semua konten terlihat tanpa JS / reduced motion. Animasi tidak
//           diulang saat scroll, tidak mengubah data, dan dibersihkan saat halaman dilepas.

(function () {
  "use strict";

  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var tokenMasuk = getComputedStyle(document.documentElement).getPropertyValue("--motion-masuk");
  var durasi = parseFloat(tokenMasuk) / 1000 || 0.26;
  var ctx = null;
  var mm = null;

  function angkaDari(teks) {
    var t = String(teks || "")
      .replace(/[^\d,.\-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    var n = parseFloat(t);
    return isFinite(n) ? n : 0;
  }

  function formatSeperti(contoh, nilai) {
    var s = String(contoh);
    var m = s.match(/^([^\d\-]*)([\d.,\-]+)(.*)$/);
    if (!m) return s;
    var angka = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(nilai);
    return m[1] + angka + m[3];
  }

  function pasangCounter(el) {
    if (!el) return;
    var akhir = el.textContent.trim();
    var target = angkaDari(akhir);
    if (!target) return;

    var lebar = Math.round(el.getBoundingClientRect().width);
    if (lebar > 0) {
      el.style.display = "inline-block";
      el.style.minWidth = lebar + "px";
    }
    var peneduh = { v: 0 };
    gsap.to(peneduh, {
      v: target,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: function () { el.textContent = formatSeperti(akhir, peneduh.v); },
      onComplete: function () {
        el.textContent = akhir;
        el.style.minWidth = "";
        el.style.display = "";
      },
      scrollTrigger: { trigger: el, start: "top 92%", once: true }
    });
  }

  function reveal(targets, trigger, o) {
    if (!targets || !targets.length) return;
    gsap.from(targets, {
      opacity: 0,
      y: (o && o.y) || 12,
      duration: durasi,
      ease: "power2.out",
      stagger: (o && o.stagger) || 0.05,
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: trigger || targets[0],
        start: "top 88%",
        once: true
      }
    });
  }

  function init() {
    if (ctx) return;

    ctx = gsap.context(function () {
      // 0. Halaman login penuh: kartu masuk sekali, tanpa menunda interaksi.
      var kartuLogin = document.querySelector(".login-kartu");
      if (kartuLogin) {
        gsap.from(kartuLogin, { opacity: 0, y: 10, duration: durasi, ease: "power2.out" });
      }

      // 1. Hero: urutan tetap — headline, deskripsi, CTA, dekorasi ringan.
      var hero = document.querySelector(".hero-isi");
      if (hero) {
        var tl = gsap.timeline({ defaults: { ease: "power2.out", duration: durasi } });
        var h1 = hero.querySelector("h1");
        var deskripsi = hero.querySelector(".hero-teks > p");
        var aksi = hero.querySelector(".hero-aksi");
        if (h1) tl.from(h1, { opacity: 0, y: 14 });
        if (deskripsi) tl.from(deskripsi, { opacity: 0, y: 10 }, "-=0.12");
        if (aksi && aksi.children.length) {
          tl.from(aksi.children, { opacity: 0, y: 8, stagger: 0.06 }, "-=0.1");
        }
      }

      // 2. Judul dan deskripsi section saat masuk viewport.
      ["home-judul-bagian", "home-jelajah-heading", "hal-kepala"].forEach(function (kelas) {
        document.querySelectorAll("." + kelas).forEach(function (wadah) {
          reveal([...wadah.querySelectorAll("h1,h2,p")], wadah, { y: 10, stagger: 0.05 });
        });
      });

      // 3. Kartu dan konten: stagger ringan, sekali per elemen.
      const grup = [
        [".home-manfaat-grid", ".home-manfaat-kartu"],
        [".home-jelajah-grid", ".home-jelajah-kartu"],
        [".kartu-grid", ".kartu-kategori"],
        [".gallery-grid", ".gallery-item"],
        [".contact-info-grid", ".info-card"],
        [".kpi-grid", ".kpi"],
        [".grafik-grid", ".panel"],
        [".dash-kartu-grid", ".dash-kartu"],
        [".ringkasan-grid", ".ringkasan-item"],
        [".kartu-harga", ".kartu-harga-item"],
        [".buku-kolom", ".buku-kartu, .buku-status"]
      ];
      grup.forEach(function (pasangan) {
        document.querySelectorAll(pasangan[0]).forEach(function (wadah) {
          reveal([...wadah.querySelectorAll(pasangan[1])], wadah, { y: 12, stagger: 0.06 });
        });
      });

      // 4. Angka statistik: count-up dari nilai asli yang sudah dirender page script.
      document.querySelectorAll('.kpi-nilai [data-metric], .dash-angka [data-metric], .target-angka [data-metric]').forEach(pasangCounter);
      ["saldo-warga", "berat-warga", "jumlah-warga", "buku-saldo", "buku-kredit", "buku-debit"].forEach(function (id) {
        pasangCounter(document.getElementById(id));
      });

      // 5. Navbar: bayangan halus setelah halaman mulai digulir. Tetap stabil (tanpa hide/show).
      var header = document.querySelector(".site-header");
      if (header) {
        ScrollTrigger.create({
          start: 12,
          end: "max",
          onToggle: function (self) { header.classList.toggle("tergulir", self.isActive); }
        });
      }
    });

    // 6. Parallax sangat terbatas pada SVG dekoratif, desktop/tablet saja.
    mm = gsap.matchMedia();
    mm.add("(min-width: 1200px)", function () {
      var ikon = document.querySelectorAll(".home-jelajah-ikon");
      if (!ikon.length) return;
      gsap.to(ikon, {
        y: -10,
        ease: "none",
        scrollTrigger: { trigger: ".home-jelajah-grid", start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });
    mm.add("(min-width: 768px) and (max-width: 1199px)", function () {
      var ikon = document.querySelectorAll(".home-jelajah-ikon");
      if (!ikon.length) return;
      gsap.to(ikon, {
        y: -5,
        ease: "none",
        scrollTrigger: { trigger: ".home-jelajah-grid", start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });
  }

  function destroy() {
    if (mm) { mm.revert(); mm = null; }
    if (ctx) { ctx.revert(); ctx = null; }
  }

  function refresh() {
    ScrollTrigger.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("load", refresh, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener("pagehide", destroy, { once: true });
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    destroy();
    init();
    refresh();
  });
})();
