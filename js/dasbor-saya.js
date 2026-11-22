// File   : js/dasbor-saya.js
// Tujuan : Menampilkan ringkasan, grafik, dan riwayat setoran milik warga yang masuk.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var sesi = window.BankAuth.sesi();
    if (!sesi || sesi.user.peran !== "warga") return;

    var Data = window.BankData;
    var Warna = window.BankGrafik;
    var pengguna = sesi.user;

    function teks(id, nilai) {
      var elemen = document.getElementById(id);
      if (elemen) elemen.textContent = nilai;
    }

    function persen(nilai) {
      return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(nilai) + "%";
    }

    function badgeJenis(nama) {
      var span = document.createElement("span");
      span.className = "badge-jenis";
      span.setAttribute("data-jenis", nama);
      span.textContent = nama;
      return span;
    }

    function isiLegenda(ringkasan) {
      var wadah = document.getElementById("jenis-warga");
      if (!wadah) return;
      wadah.replaceChildren();

      var total = ringkasan.totalKg;
      var urutan = Data.daftarJenis || Object.keys(ringkasan.perJenis);
      var ada = urutan.filter(function (jenis) {
        return (ringkasan.perJenis[jenis] || 0) > 0;
      });

      if (!ada.length) {
        var kosong = document.createElement("li");
        kosong.className = "legenda-kosong";
        kosong.textContent = "Belum ada setoran pada periode ini.";
        wadah.appendChild(kosong);
        return;
      }

      ada.forEach(function (jenis) {
        var kg = ringkasan.perJenis[jenis] || 0;
        var item = document.createElement("li");
        item.className = "legenda-item";
        item.setAttribute("data-jenis", jenis);
        item.setAttribute("data-warna", String(urutan.indexOf(jenis) + 1));

        var titik = document.createElement("span");
        titik.className = "legenda-titik";
        titik.setAttribute("aria-hidden", "true");

        var nama = document.createElement("span");
        nama.className = "legenda-nama";
        nama.textContent = jenis;

        var nilai = document.createElement("span");
        nilai.className = "legenda-nilai";
        nilai.textContent = Data.formatAngka(kg) + " kg";

        var bagian = document.createElement("span");
        bagian.className = "legenda-persen";
        bagian.textContent = total > 0 ? persen((kg / total) * 100) : "0%";

        item.append(titik, nama, nilai, bagian);
        wadah.appendChild(item);
      });
    }

    function isiDonat(ringkasan) {
      if (!Warna) return;
      var urutan = Data.daftarJenis || Object.keys(ringkasan.perJenis);
      var item = urutan.filter(function (jenis) {
        return (ringkasan.perJenis[jenis] || 0) > 0;
      }).map(function (jenis) {
        return { nama: jenis, nilai: ringkasan.perJenis[jenis] || 0 };
      });
      Warna.buatDonat(document.getElementById("grafik-komposisi-warga"), item, {
        r: 70,
        satuan: "kg total"
      });
    }

    function isiTren(ringkasan) {
      if (!Warna || !Data.seriHarian) return;
      var seri = Data.seriHarian(pengguna.id, Data.PERIODE);
      Warna.buatGaris(document.getElementById("grafik-harian-warga"), seri, {
        ringkasan: document.getElementById("ringkasan-harian-warga"),
        pesanKosong: "Belum ada setoran pada periode ini."
      });

      var badan = document.getElementById("tabel-harian-warga");
      if (!badan) return;
      badan.replaceChildren();
      if (!seri.hari.length) {
        var kosong = document.createElement("tr");
        var sel = document.createElement("td");
        sel.colSpan = 3;
        sel.className = "tabel-kosong";
        sel.textContent = "Belum ada setoran pada periode ini.";
        kosong.appendChild(sel);
        badan.appendChild(kosong);
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

    function render() {
      // Satu sumber agregat untuk dashboard dan dashboard warga.
      var agregat = Data.getAggregates ? Data.getAggregates() : null;
      var ringkasan = (agregat && agregat.perWarga[pengguna.id]) ||
        Data.ringkasanWarga(pengguna.id);
      var target = Number(ringkasan.targetKg) || 0;
      var persenNyata = target > 0 ? (ringkasan.totalKg / target) * 100 : 0;

      teks("periode-warga", ringkasan.namaPeriode);
      teks("nama-warga", pengguna.nama);
      teks("peran-warga", pengguna.peran === "petugas" ? "Petugas" : "Warga");
      teks("kode-warga", pengguna.kode || "-");
      teks("rt-warga", pengguna.rt || "-");
      teks("inisial-warga", Data.inisialNama(pengguna.nama));
      teks("saldo-warga", Data.formatRupiah(ringkasan.totalSaldo));
      teks("berat-warga", Data.formatAngka(ringkasan.totalKg));
      teks("jumlah-warga", String(ringkasan.jumlahSetoran));
      teks("target-warga", Data.formatAngka(ringkasan.targetKg));
      teks("capaian-warga", Data.formatAngka(ringkasan.totalKg));
      teks("batas-warga", Data.formatAngka(ringkasan.targetKg));
      teks("persen-warga", persen(persenNyata));

      var progres = document.getElementById("progres-warga");
      if (progres) {
        // Batasi isi batang 100%, tetapi persentase asli tetap ditampilkan.
        progres.setAttribute("max", "100");
        progres.setAttribute("value", String(Math.min(100, persenNyata)));
        progres.textContent = persen(Math.min(100, persenNyata)) + " dari target";
      }

      var tercapai = persenNyata >= 100;
      teks("status-target-warga", tercapai ? "Target tercapai" : "Sedang berjalan");
      var sisa = target - ringkasan.totalKg;
      teks("sisa-target-warga", tercapai
        ? (sisa <= 0
          ? Data.formatAngka(Math.abs(sisa)) + " kg di atas target bulan ini."
          : "Tepat sesuai target bulan ini.")
        : Data.formatAngka(Math.max(0, sisa)) + " kg lagi menuju target.");

      isiLegenda(ringkasan);
      isiDonat(ringkasan);
      isiTren(ringkasan);

      var badan = document.getElementById("badan-riwayat");
      if (badan) {
        badan.replaceChildren();
        if (!ringkasan.riwayat.length) {
          var barisKosong = document.createElement("tr");
          var selKosong = document.createElement("td");
          selKosong.colSpan = 4;
          selKosong.className = "tabel-kosong";
          selKosong.textContent = "Belum ada riwayat setoran.";
          barisKosong.appendChild(selKosong);
          badan.appendChild(barisKosong);
        }
        ringkasan.riwayat.slice(0, 5).forEach(function (item) {
          var baris = document.createElement("tr");

          var tanggal = document.createElement("td");
          var waktu = document.createElement("time");
          waktu.setAttribute("datetime", item.tanggal);
          waktu.textContent = Data.formatTanggal(item.tanggal);
          tanggal.appendChild(waktu);

          var jenis = document.createElement("td");
          jenis.appendChild(badgeJenis(item.jenis));

          var berat = document.createElement("td");
          berat.className = "angka rata-kanan";
          berat.textContent = Data.formatAngka(item.berat) + " kg";

          var saldo = document.createElement("td");
          saldo.className = "angka rata-kanan";
          saldo.textContent = Data.formatRupiah(item.nilai);

          baris.append(tanggal, jenis, berat, saldo);
          badan.appendChild(baris);
        });
      }
    }

    document.addEventListener("banksampahku:data", render);
    render();
  });
})();
