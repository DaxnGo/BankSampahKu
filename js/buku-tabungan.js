// Buku Tabungan — saldo berjalan dari data setoran yang sama dengan Dashboard.
(function(){
 "use strict";
 document.addEventListener("DOMContentLoaded",function(){
  var sesi=window.BankAuth&&window.BankAuth.sesi(); if(!sesi||sesi.user.peran!=="warga")return;
  var Data=window.BankData, pilih=document.getElementById("periode-buku"), badan=document.getElementById("badan-buku"),
      kosong=document.getElementById("kosong-buku");
  function isiPeriode(){
   var semua=Data.riwayatLengkapWarga(sesi.user.id), bulan={};
   semua.forEach(function(x){bulan[String(x.tanggal).slice(0,7)]=1;});
   Object.keys(bulan).sort().reverse().forEach(function(b){var o=document.createElement("option");o.value=b;o.textContent=Data.namaBulan(b);pilih.appendChild(o);});
  }
  function render(){
   var b=Data.bukuTabungan(sesi.user.id,pilih.value);
   document.getElementById("buku-saldo").textContent=Data.formatRupiah(b.saldoAkhir);
   document.getElementById("buku-kredit").textContent=Data.formatRupiah(b.totalKredit);
   document.getElementById("buku-debit").textContent=Data.formatRupiah(b.totalDebit);
   document.getElementById("catatan-buku").textContent="Periode "+b.namaPeriode+". "+
     (b.adaPenarikan?"":"Fitur penarikan belum tersedia, sehingga tidak ada transaksi debit.")+
     " Saldo ini sama dengan saldo yang ditampilkan pada Ringkasan untuk periode yang sama.";
   badan.replaceChildren();
   b.baris.forEach(function(x){
    var tr=document.createElement("tr");
    var tgl=document.createElement("td"),w=document.createElement("time");w.setAttribute("datetime",x.tanggal);w.textContent=Data.formatTanggal(x.tanggal);tgl.appendChild(w);
    var ket=document.createElement("td");ket.textContent=x.keterangan;
    var k=document.createElement("td");k.className="angka";k.textContent=x.kredit?Data.formatRupiah(x.kredit):"—";
    var d=document.createElement("td");d.className="angka";d.textContent=x.debit?Data.formatRupiah(x.debit):"—";
    var s=document.createElement("td");s.className="angka";s.textContent=Data.formatRupiah(x.saldo);
    tr.append(tgl,ket,k,d,s);badan.appendChild(tr);
   });
   kosong.hidden=b.baris.length>0;
  }
  pilih.addEventListener("change",render); isiPeriode();
  // Samakan dengan Ringkasan: periode aktif sistem.
  pilih.value=window.BankData.PERIODE; render();
 });
})();
