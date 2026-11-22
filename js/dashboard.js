// File   : js/dashboard.js
// Tujuan : Mengisi 34 data-metric, kartu KPI, dan grafik dari BankData.getAggregates().
// Catatan: Tanpa JavaScript, angka fallback statis di HTML tetap terbaca.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var Data = window.BankData;
    if (!Data || !document.querySelector("[data-metric]")) return;

    var Warna = window.BankGrafik;

    function agregatSekarang() {
      return Data.getAggregates ? Data.getAggregates() : Data.ringkasan();
    }

    function isi(nilai, teks) {
      var daftar = document.querySelectorAll('[data-metric="' + nilai + '"]');
      Array.prototype.forEach.call(daftar, function (elemen) {
        elemen.textContent = teks;
      });
    }

    function persen(nilai) {
      return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(nilai) + "%";
    }

    function barisKosong(badan, jumlahKolom, pesan) {
      var baris = document.createElement("tr");
      var sel = document.createElement("td");
      sel.colSpan = jumlahKolom;
      sel.className = "tabel-kosong";
      sel.textContent = pesan;
      baris.appendChild(sel);
      badan.appendChild(baris);
    }

    function badgeJenis(nama) {
      var span = document.createElement("span");
      span.className = "badge-jenis";
      span.setAttribute("data-jenis", nama);
      span.textContent = nama;
      return span;
    }

    function isiLegenda(agregat) {
      var daftar = document.querySelectorAll(".donat-legenda [data-jenis]");
      Array.prototype.forEach.call(daftar, function (item) {
        var jenis = item.getAttribute("data-jenis");
        var kg = agregat.perJenis[jenis] || 0;
        var angka = item.querySelector("[data-metric^='kg-'], [data-jenis-angka]");
        var bagian = item.querySelector(".legenda-persen");
        if (angka) angka.textContent = Data.formatAngka(kg);
        if (bagian) {
          bagian.textContent = agregat.totalKg > 0 ? persen((kg / agregat.totalKg) * 100) : "0%";
        }
      });
    }

    function isiGrafik(agregat) {
      var total = agregat.totalKg;

      if (Warna) {
        var item = agregat.daftarJenis.map(function (jenis) {
          return { nama: jenis, nilai: agregat.perJenis[jenis] || 0 };
        });
        Warna.buatDonat(document.getElementById("grafik-komposisi"), item, { r: 70, satuan: "kg total" });
      }

      var rincian = agregat.daftarJenis.map(function (jenis) {
        var kg = agregat.perJenis[jenis] || 0;
        return {
          jenis: jenis,
          kg: kg,
          persen: total > 0 ? persen((kg / total) * 100) : "0%"
        };
      });

      var kalimat = rincian.map(function (r) {
        return r.jenis + " " + Data.formatAngka(r.kg) + " kg";
      });
      var ringkasan = document.getElementById("ringkasan-komposisi");
      if (ringkasan) {
        ringkasan.textContent = kalimat.join(", ") + " dari total " +
          Data.formatAngka(total) + " kg pada " + agregat.namaPeriode + ".";
      }
      isiTabel("tabel-komposisi", rincian.map(function (r) {
        return [r.jenis, Data.formatAngka(r.kg) + " kg", r.persen];
      }));

      // Target dan sisa.
      var target = Number(agregat.targetKg) || 0;
      var persenTarget = target > 0 ? (total / target) * 100 : 0;
      var progres = document.querySelector(".progres-target");
      if (progres) {
        progres.setAttribute("value", String(total));
        progres.setAttribute("max", String(target || 1));
        progres.textContent = persen(persenTarget) + " dari target";
      }
      var sisa = document.querySelector("[data-sisa-target]");
      if (sisa) {
        sisa.textContent = target > total
          ? Data.formatAngka(target - total) + " kg"
          : "Target sudah tercapai";
      }
    }

    function isiTren(agregat) {
      if (!Warna || !Data.seriHarian) return;
      var seri = Data.seriHarian(null, agregat.periode);
      Warna.buatGaris(document.getElementById("grafik-harian"), seri, {
        ringkasan: document.getElementById("ringkasan-harian"),
        pesanKosong: "Belum ada setoran pada periode ini."
      });

      var badan = document.getElementById("tabel-harian");
      if (!badan) return;
      badan.replaceChildren();
      if (!seri.hari.length) {
        barisKosong(badan, 3, "Belum ada setoran pada periode ini.");
        return;
      }
      seri.hari.forEach(function (item) {
        var baris = document.createElement("tr");
        var tanggal = document.createElement("td");
        tanggal.textContent = Data.formatTanggal(item.tanggal);
        var berat = document.createElement("td");
        berat.textContent = Data.formatAngka(item.kg) + " kg";
        var nilai = document.createElement("td");
        nilai.textContent = Data.formatRupiah(item.nilai);
        baris.append(tanggal, berat, nilai);
        badan.appendChild(baris);
      });
    }

    function isiTabelRt(agregat) {
      var badan = document.querySelector('[aria-labelledby="judul-rt"] tbody');
      if (!badan) return;
      badan.replaceChildren();

      if (!agregat.daftarRt.length) {
        barisKosong(badan, 3, "Belum ada setoran pada periode ini.");
        return;
      }

      var maks = agregat.daftarRt[0].kg || 1;
      var total = agregat.totalKg || 1;

      agregat.daftarRt.forEach(function (entri) {
        var baris = document.createElement("tr");
        baris.setAttribute("data-metric", "rt-" + entri.rt);

        var nama = document.createElement("th");
        nama.scope = "row";
        nama.textContent = "RT " + entri.rt;

        var angka = document.createElement("td");
        angka.className = "angka";
        var nilai = document.createElement("span");
        nilai.setAttribute("data-metric", "rt-" + entri.rt + "-kg");
        nilai.textContent = Data.formatAngka(entri.kg);
        angka.append(nilai, document.createTextNode(" kg"));

        var kontribusi = document.createElement("td");
        var rel = document.createElement("span");
        rel.className = "bar-rt";
        var isiBar = document.createElement("span");
        isiBar.className = "bar-rt-isi";
        isiBar.style.width = Math.max(0, Math.min(100, (entri.kg / maks) * 100)) + "%";
        rel.appendChild(isiBar);
        var teks = document.createElement("span");
        teks.className = "bar-rt-persen";
        teks.textContent = persen((entri.kg / total) * 100);
        kontribusi.append(rel, teks);

        baris.append(nama, angka, kontribusi);
        badan.appendChild(baris);
      });

      var totalEl = document.querySelector('[data-metric="total-rt-kg"]');
      if (totalEl) totalEl.textContent = Data.formatAngka(agregat.totalKg);
    }

    function isiTabelSetoran(agregat) {
      var badan = document.getElementById("badan-setoran");
      if (!badan) return;
      badan.replaceChildren();

      if (!agregat.setoranTerbaru.length) {
        barisKosong(badan, 5, "Belum ada setoran pada periode ini.");
        return;
      }

      agregat.setoranTerbaru.forEach(function (item, indeks) {
        var baris = document.createElement("tr");
        baris.setAttribute("data-metric", "setoran-" + (indeks + 1));

        var tanggal = document.createElement("td");
        var waktu = document.createElement("time");
        waktu.setAttribute("datetime", item.tanggal);
        waktu.textContent = Data.formatTanggal(item.tanggal);
        tanggal.appendChild(waktu);

        var nama = document.createElement("td");
        nama.textContent = item.inisial;

        var jenis = document.createElement("td");
        jenis.appendChild(badgeJenis(item.jenis));

        var berat = document.createElement("td");
        berat.className = "angka rata-kanan";
        berat.setAttribute("data-metric", "setoran-" + (indeks + 1) + "-berat");
        berat.textContent = Data.formatAngka(item.berat) + " kg";

        var nilai = document.createElement("td");
        nilai.className = "angka rata-kanan";
        nilai.textContent = Data.formatRupiah(item.nilai);

        baris.append(tanggal, nama, jenis, berat, nilai);
        badan.appendChild(baris);
      });
    }

    function teks(id, nilai) {
      var el = document.getElementById(id);
      if (el) el.textContent = nilai;
    }

    function isiTabel(id, barisData) {
      var badan = document.getElementById(id);
      if (!badan) return;
      badan.replaceChildren();
      barisData.forEach(function (pasangan) {
        var baris = document.createElement("tr");
        pasangan.forEach(function (nilai) {
          var sel = document.createElement("td");
          sel.textContent = nilai;
          baris.appendChild(sel);
        });
        badan.appendChild(baris);
      });
    }

    function perbaruiPeriode(agregat) {
      var periode = document.querySelector(".dash-periode time");
      if (periode) {
        periode.setAttribute("datetime", agregat.periode);
        periode.textContent = agregat.namaPeriode;
      }
    }

    function render() {
      var agregat = agregatSekarang();

      isi("total-kg", Data.formatAngka(agregat.totalKg));
      isi("jumlah-penabung", String(agregat.jumlahPenabung));
      isi("total-saldo", Data.formatRupiah(agregat.totalSaldo));
      isi("setoran-bulan-ini", Data.formatAngka(agregat.totalKg));
      isi("target-capaian", Data.formatAngka(agregat.totalKg));
      isi("target-kg", Data.formatAngka(agregat.targetKg));
      isi("persen-target", persen(agregat.persenTarget));

      var jumlah = document.querySelector("[data-jumlah-transaksi]");
      if (jumlah) jumlah.textContent = String(agregat.jumlahTransaksi);

      isiLegenda(agregat);
      isiGrafik(agregat);
      isiTren(agregat);
      isiTabelRt(agregat);
      isiTabelSetoran(agregat);
      perbaruiPeriode(agregat);
    }

    document.addEventListener("banksampahku:data", render);
    render();
  });
})();
