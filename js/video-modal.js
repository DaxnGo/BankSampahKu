// File   : js/video-modal.js
// Tujuan : Modal pemutar video edukasi dengan kontrol HTML5 yang berfungsi.
// Catatan: Sumber video memakai YouTube. Untuk berkas lokal, isi SUMBER_VIDEO
//          dengan path lokal; kontrol HTML5 kustom akan dipakai kembali.

(function () {
  "use strict";
  function setHidden(el, nilai) {
    if (!el) return;
    if (nilai) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }


  // ===== KONFIGURASI SUMBER =====
  // Contoh: "video/panduan-memilah.mp4" atau "video/panduan-memilah.webm"
  // Boleh juga ditaruh di atribut data-sumber-video pada tombol #buka-video.
  var SUMBER_VIDEO = "";
  var JENIS_VIDEO = "video/mp4";
  var JUDUL = "Video Edukasi BankSampahKu";
  // ==============================

  var tombolBuka = document.getElementById("buka-video");
  var modal = document.getElementById("video-modal");
  if (!tombolBuka || !modal) return;

  var panel = modal.querySelector(".video-modal-panel");
  var overlay = modal.querySelector("[data-tutup-video]");
  var tombolTutup = document.getElementById("tutup-video");
  var video = document.getElementById("video-edukasi");
  var kosong = document.getElementById("video-kosong");
  var kontrol = document.getElementById("video-kontrol");
  var kontrolYoutube = document.getElementById("video-kontrol-youtube");
  var ytMundur = document.getElementById("vk-yt-mundur");
  var ytMaju = document.getElementById("vk-yt-maju");
  var ytKecepatan = document.getElementById("vk-yt-kecepatan");

  var tombolUtama = document.getElementById("vk-utama");
  var ikonMain = tombolUtama.querySelector(".vk-ikon-main");
  var ikonJeda = tombolUtama.querySelector(".vk-ikon-jeda");
  var tombolMundur = document.getElementById("vk-mundur");
  var tombolMaju = document.getElementById("vk-maju");
  var seek = document.getElementById("vk-seek");
  var waktu = document.getElementById("vk-waktu");
  var tombolVolume = document.getElementById("vk-volume");
  var ikonVolume = tombolVolume.querySelector(".vk-ikon-volume");
  var ikonBisu = tombolVolume.querySelector(".vk-ikon-bisu");
  var sliderVolume = document.getElementById("vk-volume-slider");
  var kecepatan = document.getElementById("vk-kecepatan");
  var tombolLayarPenuh = document.getElementById("vk-fullscreen");

  var sumber = tombolBuka.getAttribute("data-sumber-video") || SUMBER_VIDEO;
  var cocokYoutube = sumber.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/);
  var idYoutube = cocokYoutube ? cocokYoutube[1] : "";
  var embed = null;
  var pemutarYT = null;
  var judulEl = document.getElementById("judul-video-modal");
  var penampung = document.querySelector(".video-penampung");
  var fokusSebelumnya = null;
  var penutupTimer = null;

  function formatWaktu(detik) {
    if (!isFinite(detik) || detik < 0) detik = 0;
    var m = Math.floor(detik / 60);
    var s = Math.floor(detik % 60);
    return m + ":" + (s < 10 ? "0" + s : s);
  }

  function hentikan() {
    try {
      video.pause();
      video.currentTime = 0;
      video.playbackRate = 1;
      if (kecepatan) kecepatan.value = "1";
    } catch (galat) {
      // Video tanpa sumber tidak perlu diatur.
    }
    if (pemutarYT) {
      try { pemutarYT.stopVideo(); } catch (galat) {}
      try { pemutarYT.destroy(); } catch (galat) {}
      pemutarYT = null;
    }
    if (embed) {
      try { embed.src = "about:blank"; } catch (galat) {}
      embed.remove();
      embed = null;
    }
  }

  function muatApiYouTube(siap) {
    if (window.YT && window.YT.Player) { siap(); return; }
    var lama = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof lama === "function") lama();
      siap();
    };
    if (!document.querySelector("script[data-youtube-api]")) {
      var naskah = document.createElement("script");
      naskah.src = "https://www.youtube.com/iframe_api";
      naskah.setAttribute("data-youtube-api", "1");
      document.head.appendChild(naskah);
    }
  }

  function segarkanTombol() {
    var berhenti = video.paused || video.ended;
    setHidden(ikonMain, !berhenti);
    setHidden(ikonJeda, berhenti);
    tombolUtama.setAttribute("aria-label", berhenti ? "Putar" : "Jeda");
    tombolUtama.title = berhenti ? "Putar" : "Jeda";
  }

  function segarkanWaktu() {
    var durasi = isFinite(video.duration) ? video.duration : 0;
    waktu.textContent = formatWaktu(video.currentTime) + " / " + formatWaktu(durasi);
    seek.max = durasi > 0 ? String(durasi) : "100";
    seek.value = String(durasi > 0 ? video.currentTime : 0);
  }

  function segarkanVolume() {
    var bisu = video.muted || video.volume === 0;
    setHidden(ikonVolume, bisu);
    setHidden(ikonBisu, !bisu);
    tombolVolume.setAttribute("aria-label", bisu ? "Nyalakan suara" : "Bisukan suara");
    tombolVolume.title = bisu ? "Nyalakan suara" : "Bisukan suara";
    sliderVolume.value = String(bisu ? 0 : video.volume);
  }

  function siapkanSumber() {
    if (judulEl) judulEl.textContent = JUDUL;

    if (idYoutube) {
      // YouTube bukan berkas HTML5, jadi diputar lewat iframe resmi YouTube.
      // Kontrol play/pause, seek, volume, kecepatan, dan fullscreen disediakan pemutar YouTube.
      kosong.hidden = true;
      kontrol.hidden = true;
      if (kontrolYoutube) kontrolYoutube.hidden = false;
      if (ytMundur) ytMundur.disabled = true;
      if (ytMaju) ytMaju.disabled = true;
      if (ytKecepatan) ytKecepatan.disabled = true;
      video.hidden = true;
      video.removeAttribute("src");
      embed = document.createElement("iframe");
      embed.className = "video-embed";
      embed.id = "video-youtube";
      embed.src = "https://www.youtube-nocookie.com/embed/" + idYoutube +
        "?autoplay=1&controls=1&playsinline=1&rel=0&enablejsapi=1&origin=" +
        encodeURIComponent(location.origin);
      embed.title = JUDUL;
      embed.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      embed.setAttribute("allowfullscreen", "");
      embed.referrerPolicy = "strict-origin-when-cross-origin";
      penampung.appendChild(embed);
      var iframeAktif = embed;
      muatApiYouTube(function () {
        if (embed !== iframeAktif || !window.YT || !window.YT.Player) return;
        pemutarYT = new window.YT.Player(embed, {
          events: {
            onReady: function () {
              if (ytMundur) ytMundur.disabled = false;
              if (ytMaju) ytMaju.disabled = false;
              if (ytKecepatan) ytKecepatan.disabled = false;
            }
          }
        });
      });
      return;
    }

    video.hidden = false;
    if (kontrolYoutube) kontrolYoutube.hidden = true;
    if (sumber) {
      kosong.hidden = true;
      kontrol.hidden = false;
      video.setAttribute("src", sumber);
      video.setAttribute("type", JENIS_VIDEO);
      video.load();
    } else {
      kosong.hidden = false;
      kontrol.hidden = true;
    }
  }

  function buka() {
    if (embed) return;
    if (penutupTimer) { clearTimeout(penutupTimer); penutupTimer = null; }
    fokusSebelumnya = tombolBuka;
    siapkanSumber();
    modal.hidden = false;
    document.body.classList.add("video-terkunci");
    requestAnimationFrame(function () {
      modal.classList.add("sedang-buka");
    });
    tombolTutup.focus();
  }

  function tutup() {
    hentikan();
    modal.classList.remove("sedang-buka");
    penutupTimer = setTimeout(function () {
      modal.hidden = true;
      document.body.classList.remove("video-terkunci");
      penutupTimer = null;
      if (fokusSebelumnya && typeof fokusSebelumnya.focus === "function") {
        fokusSebelumnya.focus();
      }
    }, 200);
  }

  function fatalDiLuar(target) {
    return !panel.contains(target);
  }

  function daftarFokus() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), iframe, video[controls]'),
      function (el) { return !el.hidden && el.offsetParent !== null; }
    );
  }

  // ----- ikatan acara -----
  tombolBuka.addEventListener("click", buka);
  tombolTutup.addEventListener("click", tutup);
  overlay.addEventListener("click", function (e) {
    if (fatalDiLuar(e.target)) tutup();
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); tutup(); return; }
    if (e.key !== "Tab") return;
    var daftar = daftarFokus();
    if (!daftar.length) return;
    var pertama = daftar[0];
    var terakhir = daftar[daftar.length - 1];
    if (e.shiftKey && document.activeElement === pertama) {
      e.preventDefault(); terakhir.focus();
    } else if (!e.shiftKey && document.activeElement === terakhir) {
      e.preventDefault(); pertama.focus();
    }
  });

  tombolUtama.addEventListener("click", function () {
    if (!sumber) return;
    if (video.paused || video.ended) {
      var janji = video.play();
      if (janji && janji.catch) janji.catch(function () {});
    } else {
      video.pause();
    }
  });

  function lompat(detik) {
    if (!sumber) return;
    var durasi = isFinite(video.duration) ? video.duration : 0;
    var berikut = Math.max(0, Math.min(durasi || 0, video.currentTime + detik));
    try { video.currentTime = berikut; } catch (galat) {}
    segarkanWaktu();
  }
  tombolMundur.addEventListener("click", function () { lompat(-10); });
  tombolMaju.addEventListener("click", function () { lompat(10); });

  if (ytMundur) {
    ytMundur.addEventListener("click", function () {
      if (!pemutarYT || !pemutarYT.getCurrentTime) return;
      var berikut = Math.max(0, pemutarYT.getCurrentTime() - 10);
      pemutarYT.seekTo(berikut, true);
    });
  }
  if (ytMaju) {
    ytMaju.addEventListener("click", function () {
      if (!pemutarYT || !pemutarYT.getCurrentTime) return;
      var berikut = pemutarYT.getCurrentTime() + 10;
      pemutarYT.seekTo(berikut, true);
    });
  }
  if (ytKecepatan) {
    ytKecepatan.addEventListener("change", function () {
      if (pemutarYT && pemutarYT.setPlaybackRate) pemutarYT.setPlaybackRate(Number(ytKecepatan.value));
    });
  }

  seek.addEventListener("input", function () {
    if (!sumber) return;
    try { video.currentTime = Number(seek.value); } catch (galat) {}
    segarkanWaktu();
  });

  tombolVolume.addEventListener("click", function () {
    video.muted = !video.muted;
    segarkanVolume();
  });
  sliderVolume.addEventListener("input", function () {
    video.volume = Number(sliderVolume.value);
    video.muted = video.volume === 0;
    segarkanVolume();
  });

  kecepatan.addEventListener("change", function () {
    video.playbackRate = Number(kecepatan.value);
  });

  tombolLayarPenuh.addEventListener("click", function () {
    var target = video.requestFullscreen ? video : panel;
    if (target && target.requestFullscreen) {
      var janji = target.requestFullscreen();
      if (janji && janji.catch) janji.catch(function () {});
    }
  });

  ["timeupdate", "loadedmetadata", "durationchange"].forEach(function (nama) {
    video.addEventListener(nama, segarkanWaktu);
  });
  ["play", "pause", "ended"].forEach(function (nama) {
    video.addEventListener(nama, segarkanTombol);
  });
  video.addEventListener("volumechange", segarkanVolume);

  segarkanTombol();
  segarkanWaktu();
  segarkanVolume();
})();
