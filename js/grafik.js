// File   : js/grafik.js
// Tujuan : Grafik SVG tanpa pustaka tambahan — garis/area harian dan donat.
// Catatan: Hanya menggambar data yang diberikan. Angka, label, dan tooltip
//          memakai format Indonesia yang sama dengan js/data.js.

(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var nomorGradien = 0;

  function svgEl(nama, atribut) {
    var el = document.createElementNS(NS, nama);
    if (atribut) {
      Object.keys(atribut).forEach(function (kunci) {
        el.setAttribute(kunci, atribut[kunci]);
      });
    }
    return el;
  }

  function formatAngka(nilai) {
    return window.BankData
      ? window.BankData.formatAngka(nilai)
      : new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(Number(nilai) || 0);
  }

  function formatRupiah(nilai) {
    return window.BankData
      ? window.BankData.formatRupiah(nilai)
      : "Rp " + formatAngka(nilai);
  }

  var BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  function tanggalPendek(iso) {
    var bagian = String(iso || "").split("-");
    if (bagian.length !== 3) return String(iso || "");
    return Number(bagian[2]) + " " + (BULAN_PENDEK[Number(bagian[1]) - 1] || "");
  }

  function hariKe(iso) {
    var bagian = String(iso || "").split("-");
    return Math.max(1, Number(bagian[2]) || 1);
  }

  function maksRapi(nilai) {
    if (!(nilai > 0)) return 10;
    var pangkat = Math.pow(10, Math.floor(Math.log10(nilai)));
    var sisa = nilai / pangkat;
    var faktor = 1;
    if (sisa <= 1) faktor = 1;
    else if (sisa <= 1.5) faktor = 1.5;
    else if (sisa <= 2) faktor = 2;
    else if (sisa <= 3) faktor = 3;
    else if (sisa <= 4) faktor = 4;
    else if (sisa <= 5) faktor = 5;
    else if (sisa <= 6) faktor = 6;
    else if (sisa <= 8) faktor = 8;
    else faktor = 10;
    return faktor * pangkat;
  }

  function hapusKosong(wadah) {
    if (!wadah) return;
    Array.prototype.forEach.call(wadah.querySelectorAll(".grafik-kosong"), function (el) {
      el.remove();
    });
  }

  function pesanKosong(svg, pesan) {
    if (!svg || !svg.parentElement) return;
    svg.style.display = "none";
    var p = document.createElement("p");
    p.className = "grafik-kosong";
    p.textContent = pesan;
    svg.parentElement.appendChild(p);
  }

  // -------------------------------------------------------------------------
  // Grafik garis + area: satu titik per hari yang memiliki setoran.
  // -------------------------------------------------------------------------
  function buatGaris(svg, seri, opsi) {
    if (!svg) return;
    opsi = opsi || {};
    var wadah = svg.parentElement;
    hapusKosong(wadah);

    var data = (seri && seri.hari) || [];
    if (!data.length || !(seri.totalKg > 0)) {
      pesanKosong(svg, opsi.pesanKosong || "Belum ada setoran pada periode ini.");
      return;
    }
    svg.style.display = "";

    // Simpan <desc> agar ringkasan ARIA tidak ikut terhapus saat gambar ulang.
    var deskripsi = svg.querySelector("desc");
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (deskripsi) svg.appendChild(deskripsi);

    // Lebar mengikuti wadah agar teks sumbu tetap 10 px (tidak ikut menyusut).
    var W = Math.max(300, Math.round(svg.getBoundingClientRect().width) || 640);
    var H = W < 460 ? 240 : 220;
    var ml = W < 420 ? 36 : 42;
    var mr = 16;
    var mt = 16;
    var mb = 32;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg._lebarGrafik = W;
    var lebarPlot = W - ml - mr;
    var tinggiPlot = H - mt - mb;

    var maksData = data.reduce(function (maks, item) {
      return Math.max(maks, Number(item.kg) || 0);
    }, 0);
    var maks = maksRapi(maksData);

    var hariTerakhir = 1;
    data.forEach(function (item) {
      hariTerakhir = Math.max(hariTerakhir, hariKe(item.tanggal));
    });
    if (seri.sampai) hariTerakhir = Math.max(hariTerakhir, hariKe(seri.sampai));
    if (hariTerakhir < 2) hariTerakhir = 2;

    function posisiX(hari) {
      return ml + ((hari - 1) / (hariTerakhir - 1)) * lebarPlot;
    }
    function posisiY(nilai) {
      return mt + tinggiPlot - ((Number(nilai) || 0) / maks) * tinggiPlot;
    }

    // Gradien area, id unik agar dua grafik tidak bertabrakan.
    nomorGradien += 1;
    var idGradien = "gradien-garis-" + nomorGradien;
    var defs = svgEl("defs");
    var gradien = svgEl("linearGradient", {
      id: idGradien, x1: "0", y1: "0", x2: "0", y2: "1"
    });
    gradien.appendChild(svgEl("stop", { offset: "0", class: "gradien-atas" }));
    gradien.appendChild(svgEl("stop", { offset: "1", class: "gradien-bawah" }));
    defs.appendChild(gradien);
    svg.appendChild(defs);

    // Grid horizontal: tiga garis saja (0, tengah, atas).
    [0, 0.5, 1].forEach(function (bagian) {
      var y = mt + tinggiPlot - bagian * tinggiPlot;
      svg.appendChild(svgEl("line", {
        class: "grid", x1: ml, y1: y, x2: W - mr, y2: y
      }));
      var teks = svgEl("text", {
        class: "sumbu-teks", x: ml - 8, y: y + 3, "text-anchor": "end"
      });
      teks.textContent = formatAngka(maks * bagian) + " kg";
      svg.appendChild(teks);
    });

    // Label sumbu X: awal, tiap 7 hari, dan hari terakhir.
    // Label yang terlalu rapat (mis. 22 dan 24) dibuang agar tidak bertumpuk.
    var labelHari = [1, 8, 15, 22].filter(function (h) { return h < hariTerakhir; });
    labelHari.push(hariTerakhir);
    labelHari = labelHari.reverse().filter(function (hari, indeks, semua) {
      if (indeks === 0) return true;
      return semua[indeks - 1] - hari >= 4;
    }).reverse();
    var bulanTeks = BULAN_PENDEK[Number(String(seri.periode || "").split("-")[1]) - 1] || "";
    labelHari.forEach(function (hari) {
      var teks = svgEl("text", {
        class: "sumbu-teks", x: posisiX(hari), y: H - 10, "text-anchor": "middle"
      });
      teks.textContent = hari + (bulanTeks ? " " + bulanTeks : "");
      svg.appendChild(teks);
    });

    // Jalur area + garis.
    var titik = data.map(function (item) {
      return { x: posisiX(hariKe(item.tanggal)), y: posisiY(item.kg), item: item };
    });
    var jalur = titik.map(function (t, i) {
      return (i === 0 ? "M" : "L") + t.x.toFixed(1) + " " + t.y.toFixed(1);
    }).join(" ");
    var area = jalur + " L" + titik[titik.length - 1].x.toFixed(1) + " " + (mt + tinggiPlot) +
      " L" + titik[0].x.toFixed(1) + " " + (mt + tinggiPlot) + " Z";

    svg.appendChild(svgEl("path", { class: "area", d: area, fill: "url(#" + idGradien + ")" }));
    svg.appendChild(svgEl("path", { class: "garis", d: jalur }));

    // Titik hanya terlihat saat hover/fokus agar garis tetap bersih.
    var panduan = svgEl("line", {
      class: "panduan", x1: 0, y1: mt, x2: 0, y2: mt + tinggiPlot
    });
    var titikAktif = svgEl("circle", { class: "titik titik-aktif", r: 4.5, cx: 0, cy: 0 });
    titikAktif.style.opacity = "0";
    svg.appendChild(panduan);
    svg.appendChild(titikAktif);

    var tooltip = wadah.querySelector(".grafik-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "grafik-tooltip";
      tooltip.hidden = true;
      wadah.appendChild(tooltip);
    }

    function tampilkan(t) {
      if (!t) return;
      panduan.setAttribute("x1", t.x.toFixed(1));
      panduan.setAttribute("x2", t.x.toFixed(1));
      panduan.style.opacity = "1";
      titikAktif.setAttribute("cx", t.x.toFixed(1));
      titikAktif.setAttribute("cy", t.y.toFixed(1));
      titikAktif.style.opacity = "1";

      tooltip.replaceChildren();
      var kuat = document.createElement("strong");
      kuat.textContent = formatAngka(t.item.kg) + " kg";
      var kecil = document.createElement("span");
      kecil.textContent = tanggalPendek(t.item.tanggal) + " · " + formatRupiah(t.item.nilai);
      tooltip.append(kuat, kecil);
      tooltip.hidden = false;

      var kotak = svg.getBoundingClientRect();
      if (!kotak.width) return;
      var kiri = (t.x / W) * kotak.width;
      kiri = Math.max(72, Math.min(kotak.width - 72, kiri));
      tooltip.style.left = kiri + "px";
      tooltip.style.top = (t.y / H) * kotak.height + "px";
    }

    function sembunyikan() {
      panduan.style.opacity = "0";
      titikAktif.style.opacity = "0";
      tooltip.hidden = true;
    }

    function cariTerdekat(klienX) {
      var kotak = svg.getBoundingClientRect();
      if (!kotak.width) return null;
      var xSvg = ((klienX - kotak.left) / kotak.width) * W;
      var terdekat = null;
      var jarak = Infinity;
      titik.forEach(function (t) {
        var d = Math.abs(t.x - xSvg);
        if (d < jarak) { jarak = d; terdekat = t; }
      });
      return terdekat;
    }

    svg.addEventListener("pointermove", function (e) {
      tampilkan(cariTerdekat(e.clientX));
    });
    svg.addEventListener("pointerleave", sembunyikan);
    svg.addEventListener("pointercancel", sembunyikan);

    // Ringkasan untuk pembaca layar.
    if (opsi.ringkasan) {
      var total = seri.totalKg;
      var puncak = data.reduce(function (a, b) { return b.kg > a.kg ? b : a; }, data[0]);
      opsi.ringkasan.textContent = "Grafik " + data.length + " hari setoran pada " +
        seri.namaPeriode + ". Total " + formatAngka(total) + " kg; puncak " +
        formatAngka(puncak.kg) + " kg pada " + tanggalPendek(puncak.tanggal) + ".";
    }

    // Gambar ulang saat lebar wadah berubah (mis. rotasi layar atau sidebar).
    if ("ResizeObserver" in window && !svg._pengamatGrafik) {
      svg._pengamatGrafik = new ResizeObserver(function () {
        if (!svg.isConnected) return;
        var lebar = Math.round(svg.getBoundingClientRect().width);
        if (lebar > 0 && Math.abs(lebar - (svg._lebarGrafik || 0)) > 8) {
          buatGaris(svg, seri, opsi);
        }
      });
      svg._pengamatGrafik.observe(wadah);
    }
  }

  // -------------------------------------------------------------------------
  // Donat: potongan per jenis + total di tengah.
  // -------------------------------------------------------------------------
  function buatDonat(svg, item, opsi) {
    if (!svg) return;
    opsi = opsi || {};
    var g = svg.querySelector("[data-donat-bagian]");
    var angkaEl = svg.querySelector("[data-donat-angka]");
    var satuanEl = svg.querySelector("[data-donat-satuan]");
    var total = item.reduce(function (jumlah, it) {
      return jumlah + (Number(it.nilai) || 0);
    }, 0);

    if (g) {
      while (g.firstChild) g.removeChild(g.firstChild);
    }
    if (total <= 0) {
      if (angkaEl) angkaEl.textContent = "0";
      if (satuanEl) satuanEl.textContent = "belum ada data";
      return;
    }

    var r = Number(opsi.r) || 70;
    var keliling = 2 * Math.PI * r;
    var celah = item.length > 1 ? Math.min(3, keliling * 0.006) : 0;
    var berjalan = 0;

    item.forEach(function (it, indeks) {
      var bagian = (Number(it.nilai) || 0) / total;
      var panjang = Math.max(0, bagian * keliling - celah);
      var lingkaran = svgEl("circle", {
        class: "donat-bagian donat-warna-" + ((indeks % 5) + 1),
        cx: 100,
        cy: 100,
        r: r,
        "stroke-dasharray": panjang.toFixed(2) + " " + (keliling - panjang).toFixed(2),
        "stroke-dashoffset": (-berjalan).toFixed(2)
      });
      var judul = svgEl("title");
      judul.textContent = it.nama + ": " + formatAngka(it.nilai) + " kg (" +
        new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(bagian * 100) + "%)";
      lingkaran.appendChild(judul);
      if (g) g.appendChild(lingkaran);
      berjalan += bagian * keliling;
    });

    if (angkaEl) angkaEl.textContent = formatAngka(total);
    if (satuanEl) satuanEl.textContent = opsi.satuan || "kg total";
  }

  window.BankGrafik = {
    buatGaris: buatGaris,
    buatDonat: buatDonat,
    tanggalPendek: tanggalPendek,
    maksRapi: maksRapi
  };
})();
