// File   : js/setoran.js
// Tujuan : Menangani form input setoran petugas dan daftar transaksi.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-setoran");
    if (!form) return;

    var Data = window.BankData;
    var kolomTanggal = document.getElementById("tanggal-setoran");
    var pilihPenabung = document.getElementById("penabung");
    var kolomRt = document.getElementById("rt-setoran");
    var pilihJenis = document.getElementById("jenis-setoran");
    var kolomBerat = document.getElementById("berat-setoran");
    var estimasi = document.getElementById("estimasi-setoran");
    var kotakPesan = document.getElementById("pesan-setoran");
    var badanTabel = document.getElementById("badan-setor");
    var tombolUlang = document.getElementById("ulang-setoran");

    function pesan(teks, keadaan) {
      kotakPesan.textContent = teks;
      kotakPesan.dataset.keadaan = keadaan || "salah";
    }

    function bersihkanPesan() {
      kotakPesan.textContent = "";
      kotakPesan.removeAttribute("data-keadaan");
    }

    function isiPilihan() {
      var pengguna = Data.ambilData().pengguna.filter(function (p) {
        return p.peran === "warga";
      });
      pengguna.forEach(function (p) {
        var opsi = document.createElement("option");
        opsi.value = p.id;
        opsi.textContent = p.nama + " (RT " + p.rt + ")";
        opsi.dataset.rt = p.rt;
        pilihPenabung.appendChild(opsi);
      });

      Data.daftarJenis.forEach(function (jenis) {
        var opsi = document.createElement("option");
        opsi.value = jenis;
        opsi.textContent = jenis + " — " + Data.formatRupiah(Data.HARGA[jenis]) + "/kg";
        pilihJenis.appendChild(opsi);
      });
    }

    function hitungEstimasi() {
      var harga = Data.HARGA[pilihJenis.value] || 0;
      var berat = Number(kolomBerat.value);
      estimasi.textContent = Data.formatRupiah(harga * (berat > 0 ? berat : 0));
    }

    function buatBaris(item) {
      var baris = document.createElement("tr");
      var pengguna = Data.cariUserById(item.userId);
      var sel = [
        ["td", Data.formatTanggal(item.tanggal)],
        ["td", pengguna ? pengguna.nama : "Penabung"],
        ["td", item.rt],
        ["td", item.jenis],
        ["td", Data.formatAngka(item.berat) + " kg"],
        ["td", Data.formatRupiah(Data.nilaiSetoran(item))]
      ];

      sel.forEach(function (pasangan) {
        var kolom = document.createElement(pasangan[0]);
        kolom.textContent = pasangan[1];
        baris.appendChild(kolom);
      });

      var aksi = document.createElement("td");
      var tombol = document.createElement("button");
      tombol.type = "button";
      tombol.className = "tombol-hapus";
      tombol.textContent = "Hapus";
      tombol.setAttribute("aria-label", "Hapus setoran " + item.id);
      tombol.addEventListener("click", function () {
        if (!window.confirm("Hapus setoran ini?")) return;
        Data.hapusSetoran(item.id);
        tampilkanTabel();
        pesan("Setoran dihapus.", "ok");
      });
      aksi.appendChild(tombol);
      baris.appendChild(aksi);
      return baris;
    }

    function tampilkanTabel() {
      var semua = Data.ambilData().setoran.slice().sort(function (a, b) {
        return b.tanggal.localeCompare(a.tanggal) || String(b.id).localeCompare(String(a.id));
      }).slice(0, 10);
      badanTabel.replaceChildren();
      if (!semua.length) {
        var kosong = document.createElement("tr");
        var sel = document.createElement("td");
        sel.colSpan = 7;
        sel.textContent = "Belum ada setoran tercatat.";
        kosong.appendChild(sel);
        badanTabel.appendChild(kosong);
        return;
      }
      semua.forEach(function (item) {
        badanTabel.appendChild(buatBaris(item));
      });
    }

    pilihPenabung.addEventListener("change", function () {
      var opsi = pilihPenabung.options[pilihPenabung.selectedIndex];
      kolomRt.value = opsi && opsi.dataset.rt ? "RT " + opsi.dataset.rt : "";
    });

    [pilihJenis, kolomBerat].forEach(function (kolom) {
      kolom.addEventListener("input", hitungEstimasi);
      kolom.addEventListener("change", hitungEstimasi);
    });

    [kolomTanggal, pilihPenabung, kolomBerat].forEach(function (kolom) {
      kolom.addEventListener("input", bersihkanPesan);
    });

    form.addEventListener("submit", function (acara) {
      acara.preventDefault();

      if (!kolomTanggal.value) {
        pesan("Pilih tanggal setoran terlebih dahulu.");
        kolomTanggal.focus();
        return;
      }
      var opsi = pilihPenabung.options[pilihPenabung.selectedIndex];
      if (!opsi || !opsi.value) {
        pesan("Pilih penabung terlebih dahulu.");
        pilihPenabung.focus();
        return;
      }
      if (!Data.HARGA[pilihJenis.value]) {
        pesan("Pilih jenis sampah terlebih dahulu.");
        pilihJenis.focus();
        return;
      }
      var berat = Number(kolomBerat.value);
      if (!kolomBerat.value.trim() || !Number.isFinite(berat) || berat <= 0) {
        pesan("Masukkan berat lebih dari 0 kg.");
        kolomBerat.focus();
        return;
      }

      Data.tambahSetoran({
        tanggal: kolomTanggal.value,
        userId: opsi.value,
        jenis: pilihJenis.value,
        berat: berat,
        rt: opsi.dataset.rt || "-"
      });

      pesan("Setoran tersimpan. Dashboard sudah diperbarui.", "ok");
      kolomBerat.value = "";
      hitungEstimasi();
      tampilkanTabel();
    });

    tombolUlang.addEventListener("click", function () {
      window.setTimeout(function () {
        kolomRt.value = "";
        hitungEstimasi();
        bersihkanPesan();
      }, 0);
    });

    document.addEventListener("banksampahku:data", tampilkanTabel);

    isiPilihan();
    hitungEstimasi();
    tampilkanTabel();
  });
})();
