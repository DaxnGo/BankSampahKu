// File   : js/dashboard.js
// Tujuan : Mengisi penanda data-metric di dashboard.html dari data demo.
// Catatan: Tanpa JavaScript, halaman tetap menampilkan angka contoh statis.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var Data = window.BankData;
    if (!Data || !document.querySelector("[data-metric]")) return;

    function isi(nilai, teks) {
      var daftar = document.querySelectorAll('[data-metric="' + nilai + '"]');
      Array.prototype.forEach.call(daftar, function (elemen) {
        elemen.textContent = teks;
      });
    }

    function buatMeter(nilai, maksimum, label) {
      var meter = document.createElement("meter");
      meter.className = "dash-meter";
      meter.setAttribute("value", String(nilai));
      meter.setAttribute("max", String(maksimum));
      meter.textContent = label;
      return meter;
    }

    function isiBatang(ringkasan) {
      var daftar = document.querySelector(".dash-batang-daftar");
      if (!daftar) return;
      var maksimum = 500;
      daftar.replaceChildren();

      ringkasan.daftarJenis.forEach(function (jenis) {
        var kg = ringkasan.perJenis[jenis] || 0;
        var item = document.createElement("li");
        item.className = "dash-batang";
        item.setAttribute("data-metric", "baris-" + jenis.toLowerCase());

        var label = document.createElement("p");
        label.className = "dash-batang-label";
        label.textContent = jenis;

        var angka = document.createElement("p");
        angka.className = "dash-batang-nilai";
        var penanda = document.createElement("span");
        penanda.setAttribute("data-metric", "kg-" + jenis.toLowerCase());
        penanda.textContent = Data.formatAngka(kg);
        angka.append(penanda, document.createTextNode(" kg"));

        item.append(label, angka, buatMeter(kg, maksimum, Data.formatAngka(kg) + " kg dari " + maksimum + " kg"));
        daftar.appendChild(item);
      });

      var skala = document.querySelector(".dash-skala");
      if (skala) {
        skala.textContent = "Skala batang: 0 sampai " + maksimum + " kg. Total " +
          ringkasan.daftarJenis.length + " jenis: " + Data.formatAngka(ringkasan.totalKg) + " kg.";
      }
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

    function isiTabelRt(ringkasan) {
      var badan = document.querySelector('[aria-labelledby="judul-rt"] tbody');
      if (!badan) return;
      badan.replaceChildren();
      var maksimum = 500;

      if (!ringkasan.daftarRt.length) {
        barisKosong(badan, 3, "Belum ada setoran pada periode ini.");
      }

      ringkasan.daftarRt.forEach(function (entri) {
        var baris = document.createElement("tr");
        baris.setAttribute("data-metric", "rt-" + entri.rt);

        var nama = document.createElement("th");
        nama.scope = "row";
        nama.textContent = "RT " + entri.rt;

        var angka = document.createElement("td");
        angka.setAttribute("data-metric", "rt-" + entri.rt + "-kg");
        angka.textContent = Data.formatAngka(entri.kg);

        var batang = document.createElement("td");
        batang.appendChild(buatMeter(entri.kg, maksimum, Data.formatAngka(entri.kg) + " kg dari " + maksimum + " kg"));

        baris.append(nama, angka, batang);
        badan.appendChild(baris);
      });

      var total = document.querySelector('[data-metric="total-rt-kg"]');
      if (total) total.textContent = Data.formatAngka(ringkasan.totalKg);
    }

    function isiTabelSetoran(ringkasan) {
      var badan = document.querySelector('[aria-labelledby="judul-setoran"] tbody');
      if (!badan) return;
      badan.replaceChildren();

      if (!ringkasan.setoranTerbaru.length) {
        barisKosong(badan, 4, "Belum ada setoran pada periode ini.");
      }

      ringkasan.setoranTerbaru.forEach(function (item, indeks) {
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
        jenis.textContent = item.jenis;

        var berat = document.createElement("td");
        berat.setAttribute("data-metric", "setoran-" + (indeks + 1) + "-berat");
        berat.textContent = Data.formatAngka(item.berat) + " kg";

        baris.append(tanggal, nama, jenis, berat);
        badan.appendChild(baris);
      });
    }

    function perbaruiCatatan(ringkasan) {
      var lencana = document.querySelector(".dash-contoh");
      if (lencana) lencana.lastChild.textContent = " Data demo di browser";

      var periode = document.querySelector(".dash-periode time");
      if (periode) {
        periode.setAttribute("datetime", ringkasan.periode);
        periode.textContent = ringkasan.namaPeriode;
      }

      var catatan = document.querySelector(".dash-catatan p");
      if (catatan) {
        catatan.replaceChildren();
        var kuat = document.createElement("strong");
        kuat.textContent = "Data contoh tersimpan di browser dan dapat diubah petugas.";
        catatan.append(kuat, document.createTextNode(
          " Angka-angka di halaman ini dihitung ulang dari setoran yang dicatat di " +
          "halaman Input Setoran. Gunakan tombol \"Kembalikan data contoh awal\" di halaman masuk untuk mengulang."
        ));
      }
    }

    function render() {
      var ringkasan = Data.ringkasan();
      var persen = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(ringkasan.persenTarget);

      isi("total-kg", Data.formatAngka(ringkasan.totalKg));
      isi("jumlah-penabung", String(ringkasan.jumlahPenabung));
      isi("total-saldo", Data.formatRupiah(ringkasan.totalSaldo));
      isi("setoran-bulan-ini", Data.formatAngka(ringkasan.setoranBulanIni));
      isi("target-capaian", Data.formatAngka(ringkasan.totalKg));
      isi("target-kg", Data.formatAngka(ringkasan.targetKg));
      isi("persen-target", persen + "%");

      var progres = document.querySelector(".dash-progress");
      if (progres) {
        progres.setAttribute("value", String(ringkasan.totalKg));
        progres.setAttribute("max", String(ringkasan.targetKg));
        progres.textContent = persen + "% dari target";
      }

      isiBatang(ringkasan);
      isiTabelRt(ringkasan);
      isiTabelSetoran(ringkasan);
      perbaruiCatatan(ringkasan);
    }

    document.addEventListener("banksampahku:data", render);
    render();
  });
})();
