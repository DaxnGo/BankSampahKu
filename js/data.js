// File   : js/data.js
// Tujuan : Lapisan data demo BankSampahKu berbasis localStorage.
// Catatan: Ini SIMULASI untuk keperluan tugas. Password disimpan apa adanya
//          di browser dan TIDAK aman. Jangan dipakai dengan data sungguhan.

(function () {
  "use strict";

  var KUNCI_DATA = "banksampahku.data.v1";
  var KUNCI_SESI = "banksampahku.sesi.v1";
  var PERIODE = "2026-10";

  var HARGA = {
    Plastik: 2500,
    Kertas: 1500,
    Kardus: 2000,
    Logam: 5000,
    Kaca: 500
  };
  var JENIS = Object.keys(HARGA);

  var penggunaAwal = [
    { id: "p1", username: "petugas", password: "petugas123", nama: "Petugas Bank Sampah", peran: "petugas", rt: "-" },
    { id: "w1", username: "warga", password: "warga123", nama: "Siti Aminah", peran: "warga", rt: "03", kode: "W-003" },
    { id: "w2", username: "budi", password: "warga123", nama: "Budi Santoso", peran: "warga", rt: "01", kode: "W-001" },
    { id: "w3", username: "rina", password: "warga123", nama: "Rina Dewi", peran: "warga", rt: "05", kode: "W-005" },
    { id: "w4", username: "andi", password: "warga123", nama: "Andi Pratama", peran: "warga", rt: "02", kode: "W-002" }
  ];

  var setoranMentah = [
    ["2026-10-24", "w4", "Kardus", 10, "02"],
    ["2026-10-23", "w4", "Plastik", 11, "02"],
    ["2026-10-22", "w4", "Kertas", 9, "02"],
    ["2026-10-21", "w3", "Plastik", 16, "05"],
    ["2026-10-20", "w2", "Kaca", 11, "01"],
    ["2026-10-19", "w1", "Logam", 6, "03"],
    ["2026-10-18", "w3", "Kardus", 15, "05"],
    ["2026-10-17", "w2", "Plastik", 13, "01"],
    ["2026-10-16", "w1", "Kertas", 10, "03"],
    ["2026-10-15", "w1", "Plastik", 14, "03"],
    ["2026-10-14", "w2", "Kaca", 9.5, "01"],
    ["2026-10-13", "w3", "Logam", 7, "05"],
    ["2026-10-12", "w1", "Plastik", 12.5, "03"],
    ["2026-10-11", "w2", "Kardus", 8, "01"],
    ["2026-10-10", "w3", "Logam", 4.5, "05"],
    ["2026-10-09", "w1", "Kaca", 6, "03"],
    ["2026-10-08", "w2", "Plastik", 9, "01"],
    ["2026-10-07", "w3", "Kertas", 7, "05"],
    ["2026-10-06", "w1", "Kardus", 11, "03"],
    ["2026-10-05", "w2", "Logam", 5.5, "01"],
    ["2026-10-04", "w3", "Plastik", 10, "05"],
    ["2026-10-03", "w1", "Kaca", 8, "03"],
    ["2026-10-02", "w2", "Kertas", 6.5, "01"],
    ["2026-10-01", "w3", "Kardus", 12, "05"]
  ];

  function dataAwal() {
    return {
      pengguna: penggunaAwal.map(function (p) {
        return Object.assign({}, p);
      }),
      setoran: setoranMentah.map(function (baris, indeks) {
        return {
          id: "S" + (100 + indeks),
          tanggal: baris[0],
          userId: baris[1],
          jenis: baris[2],
          berat: baris[3],
          rt: baris[4]
        };
      }),
      target: { bulan: PERIODE, kg: 400 }
    };
  }

  function beriTahu(data) {
    if (typeof document === "undefined") return;
    document.dispatchEvent(new CustomEvent("banksampahku:data", { detail: data }));
  }

  function simpanData(data) {
    localStorage.setItem(KUNCI_DATA, JSON.stringify(data));
    beriTahu(data);
  }

  function ambilData() {
    var mentah;
    try {
      mentah = localStorage.getItem(KUNCI_DATA);
      if (mentah) {
        var data = JSON.parse(mentah);
        if (data && Array.isArray(data.pengguna) && Array.isArray(data.setoran) && data.target) {
          return data;
        }
      }
    } catch (kesalahan) {
      // Data rusak: ganti dengan data awal agar halaman tetap bisa dibuka.
    }
    var awal = dataAwal();
    localStorage.setItem(KUNCI_DATA, JSON.stringify(awal));
    return awal;
  }

  function resetData() {
    var awal = dataAwal();
    simpanData(awal);
    return awal;
  }

  function cariUser(username, password) {
    var data = ambilData();
    var nama = String(username || "").trim().toLowerCase();
    var kata = String(password || "");
    var ditemukan = data.pengguna.find(function (p) {
      return p.username.toLowerCase() === nama && p.password === kata;
    });
    return ditemukan ? Object.assign({}, ditemukan) : null;
  }

  function cariUserById(id) {
    var data = ambilData();
    var ditemukan = data.pengguna.find(function (p) {
      return p.id === id;
    });
    return ditemukan ? Object.assign({}, ditemukan) : null;
  }

  function tambahSetoran(entri) {
    var data = ambilData();
    var item = {
      id: "S" + Date.now(),
      tanggal: entri.tanggal,
      userId: entri.userId,
      jenis: entri.jenis,
      berat: Number(entri.berat),
      rt: entri.rt
    };
    data.setoran.unshift(item);
    simpanData(data);
    return item;
  }

  function hapusSetoran(id) {
    var data = ambilData();
    var sebelum = data.setoran.length;
    data.setoran = data.setoran.filter(function (item) {
      return item.id !== id;
    });
    if (data.setoran.length === sebelum) return false;
    simpanData(data);
    return true;
  }

  function ambilSesi() {
    try {
      var mentah = localStorage.getItem(KUNCI_SESI);
      if (!mentah) return null;
      var sesi = JSON.parse(mentah);
      var user = sesi && sesi.userId ? cariUserById(sesi.userId) : null;
      if (!user) {
        localStorage.removeItem(KUNCI_SESI);
        return null;
      }
      return { userId: user.id, masukPada: sesi.masukPada || "", user: user };
    } catch (kesalahan) {
      localStorage.removeItem(KUNCI_SESI);
      return null;
    }
  }

  function simpanSesi(userId) {
    localStorage.setItem(KUNCI_SESI, JSON.stringify({
      userId: userId,
      masukPada: new Date().toISOString()
    }));
  }

  function hapusSesi() {
    localStorage.removeItem(KUNCI_SESI);
  }

  function graphem(teks) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      var pemecah = new Intl.Segmenter("id", { granularity: "grapheme" });
      return Array.from(pemecah.segment(teks)).map(function (bagian) {
        return bagian.segment;
      });
    }
    return Array.from(String(teks));
  }

  function inisialNama(nama) {
    var teks = String(nama || "").trim();
    if (!teks) return "?";
    return graphem(teks)[0].toUpperCase();
  }

  function inisialSingkat(nama) {
    var teks = String(nama || "").trim();
    if (!teks) return "P.";
    return teks.split(/\s+/).map(inisialNama).join(".") + ".";
  }

  function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(nilai) || 0);
  }

  function formatAngka(nilai) {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(Number(nilai) || 0);
  }

  function formatTanggal(iso) {
    var bagian = String(iso || "").split("-");
    if (bagian.length !== 3) return String(iso || "");
    var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var indeks = Number(bagian[1]) - 1;
    return Number(bagian[2]) + " " + (bulan[indeks] || "") + " " + bagian[0];
  }

  function namaBulan(periode) {
    var bagian = String(periode || "").split("-");
    var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var indeks = Number(bagian[1]) - 1;
    return (bulan[indeks] || "") + " " + bagian[0];
  }

  function nilaiSetoran(item) {
    return item.berat * (HARGA[item.jenis] || 0);
  }

  function ringkasan(periode) {
    var data = ambilData();
    var bulan = periode || PERIODE;
    var semua = data.setoran.slice();
    var dalamBulan = semua.filter(function (item) {
      return String(item.tanggal).indexOf(bulan) === 0;
    });
    var perJenis = {};
    var perRt = {};
    var totalKg = 0;
    var totalSaldo = 0;
    var penabung = {};

    JENIS.forEach(function (jenis) {
      perJenis[jenis] = 0;
    });

    dalamBulan.forEach(function (item) {
      totalKg += item.berat;
      totalSaldo += nilaiSetoran(item);
      penabung[item.userId] = true;
      if (perJenis[item.jenis] === undefined) perJenis[item.jenis] = 0;
      perJenis[item.jenis] += item.berat;
      if (perRt[item.rt] === undefined) perRt[item.rt] = 0;
      perRt[item.rt] += item.berat;
    });

    var daftarRt = Object.keys(perRt).map(function (rt) {
      return { rt: rt, kg: perRt[rt] };
    }).sort(function (a, b) {
      return b.kg - a.kg;
    });

    var terbaru = dalamBulan.slice().sort(function (a, b) {
      return b.tanggal.localeCompare(a.tanggal) || String(b.id).localeCompare(String(a.id));
    }).slice(0, 5).map(function (item) {
      var user = data.pengguna.find(function (p) {
        return p.id === item.userId;
      });
      return {
        id: item.id,
        tanggal: item.tanggal,
        nama: user ? user.nama : "Penabung",
        inisial: user ? inisialSingkat(user.nama) : "P.",
        jenis: item.jenis,
        berat: item.berat,
        nilai: nilaiSetoran(item)
      };
    });

    var targetKg = Number(data.target && data.target.kg) || 0;
    return {
      periode: bulan,
      namaPeriode: namaBulan(bulan),
      totalKg: totalKg,
      jumlahPenabung: Object.keys(penabung).length,
      totalSaldo: totalSaldo,
      setoranBulanIni: totalKg,
      perJenis: perJenis,
      daftarJenis: JENIS.slice(),
      daftarRt: daftarRt,
      targetKg: targetKg,
      persenTarget: targetKg > 0 ? (totalKg / targetKg) * 100 : 0,
      setoranTerbaru: terbaru,
      jumlahTransaksi: dalamBulan.length
    };
  }

  function ringkasanWarga(userId, periode) {
    var data = ambilData();
    var bulan = periode || PERIODE;
    var user = cariUserById(userId);
    var semua = data.setoran.filter(function (item) {
      return item.userId === userId;
    });
    var dalamBulan = semua.filter(function (item) {
      return String(item.tanggal).indexOf(bulan) === 0;
    });
    var totalKg = dalamBulan.reduce(function (jumlah, item) {
      return jumlah + item.berat;
    }, 0);
    var totalSaldo = dalamBulan.reduce(function (jumlah, item) {
      return jumlah + nilaiSetoran(item);
    }, 0);
    var perJenis = {};
    dalamBulan.forEach(function (item) {
      if (perJenis[item.jenis] === undefined) perJenis[item.jenis] = 0;
      perJenis[item.jenis] += item.berat;
    });
    var riwayat = semua.slice().sort(function (a, b) {
      return b.tanggal.localeCompare(a.tanggal) || String(b.id).localeCompare(String(a.id));
    }).map(function (item) {
      return {
        id: item.id,
        tanggal: item.tanggal,
        jenis: item.jenis,
        berat: item.berat,
        nilai: nilaiSetoran(item)
      };
    });

    return {
      user: user,
      namaPeriode: namaBulan(bulan),
      targetKg: 50,
      totalKg: totalKg,
      totalSaldo: totalSaldo,
      perJenis: perJenis,
      riwayat: riwayat,
      jumlahSetoran: dalamBulan.length
    };
  }

  window.BankData = {
    KUNCI_DATA: KUNCI_DATA,
    KUNCI_SESI: KUNCI_SESI,
    PERIODE: PERIODE,
    HARGA: HARGA,
    daftarJenis: JENIS,
    ambilData: ambilData,
    simpanData: simpanData,
    resetData: resetData,
    cariUser: cariUser,
    cariUserById: cariUserById,
    tambahSetoran: tambahSetoran,
    hapusSetoran: hapusSetoran,
    ambilSesi: ambilSesi,
    simpanSesi: simpanSesi,
    hapusSesi: hapusSesi,
    inisialNama: inisialNama,
    inisialSingkat: inisialSingkat,
    formatRupiah: formatRupiah,
    formatAngka: formatAngka,
    formatTanggal: formatTanggal,
    namaBulan: namaBulan,
    nilaiSetoran: nilaiSetoran,
    ringkasan: ringkasan,
    ringkasanWarga: ringkasanWarga
  };
})();
