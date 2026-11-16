// File   : js/dasbor-saya.js
// Tujuan : Menampilkan ringkasan dan riwayat setoran milik warga yang masuk.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var sesi = window.BankAuth.sesi();
    if (!sesi || sesi.user.peran !== "warga") return;

    var Data = window.BankData;
    var pengguna = sesi.user;

    function teks(id, nilai) {
      var elemen = document.getElementById(id);
      if (elemen) elemen.textContent = nilai;
    }

    function render() {
      var ringkasan = Data.ringkasanWarga(pengguna.id);
      var persen = ringkasan.targetKg > 0 ? (ringkasan.totalKg / ringkasan.targetKg) * 100 : 0;
      var persenTeks = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(persen) + "%";

      teks("periode-warga", ringkasan.namaPeriode);
      teks("nama-warga", pengguna.nama);
      teks("kode-warga", pengguna.kode || "-");
      teks("rt-warga", pengguna.rt || "-");
      teks("inisial-warga", pengguna.nama.charAt(0));
      teks("saldo-warga", Data.formatRupiah(ringkasan.totalSaldo));
      teks("berat-warga", Data.formatAngka(ringkasan.totalKg));
      teks("jumlah-warga", String(ringkasan.jumlahSetoran));
      teks("target-warga", Data.formatAngka(ringkasan.targetKg));
      teks("capaian-warga", Data.formatAngka(ringkasan.totalKg));
      teks("batas-warga", Data.formatAngka(ringkasan.targetKg));
      teks("persen-warga", persenTeks);

      var progres = document.getElementById("progres-warga");
      if (progres) {
        progres.setAttribute("value", String(ringkasan.totalKg));
        progres.setAttribute("max", String(ringkasan.targetKg));
        progres.textContent = persenTeks + " dari target";
      }

      var daftarJenis = document.getElementById("jenis-warga");
      if (daftarJenis) {
        daftarJenis.replaceChildren();
        var jenisTersedia = Object.keys(ringkasan.perJenis);
        if (!jenisTersedia.length) {
          var kosong = document.createElement("li");
          kosong.className = "dash-batang";
          kosong.textContent = "Belum ada setoran pada periode ini.";
          daftarJenis.appendChild(kosong);
        }
        jenisTersedia.forEach(function (jenis) {
          var kg = ringkasan.perJenis[jenis];
          var item = document.createElement("li");
          item.className = "dash-batang";

          var label = document.createElement("p");
          label.className = "dash-batang-label";
          label.textContent = jenis;

          var angka = document.createElement("p");
          angka.className = "dash-batang-nilai";
          angka.textContent = Data.formatAngka(kg) + " kg";

          var meter = document.createElement("meter");
          meter.className = "dash-meter";
          meter.setAttribute("value", String(kg));
          meter.setAttribute("max", "50");
          meter.textContent = Data.formatAngka(kg) + " kg dari 50 kg";

          item.append(label, angka, meter);
          daftarJenis.appendChild(item);
        });
      }

      var badan = document.getElementById("badan-riwayat");
      if (badan) {
        badan.replaceChildren();
        if (!ringkasan.riwayat.length) {
          var barisKosong = document.createElement("tr");
          var selKosong = document.createElement("td");
          selKosong.colSpan = 4;
          selKosong.textContent = "Belum ada riwayat setoran.";
          barisKosong.appendChild(selKosong);
          badan.appendChild(barisKosong);
        }
        ringkasan.riwayat.slice(0, 10).forEach(function (item) {
          var baris = document.createElement("tr");

          var tanggal = document.createElement("td");
          var waktu = document.createElement("time");
          waktu.setAttribute("datetime", item.tanggal);
          waktu.textContent = Data.formatTanggal(item.tanggal);
          tanggal.appendChild(waktu);

          var jenis = document.createElement("td");
          jenis.textContent = item.jenis;

          var berat = document.createElement("td");
          berat.textContent = Data.formatAngka(item.berat) + " kg";

          var saldo = document.createElement("td");
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
