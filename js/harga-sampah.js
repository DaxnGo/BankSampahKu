// Harga Sampah — daftar harga contoh dari BankData.
(function(){
 "use strict";
 document.addEventListener("DOMContentLoaded",function(){
  var sesi=window.BankAuth&&window.BankAuth.sesi(); if(!sesi)return;
  var Data=window.BankData;
  var semua=Data.daftarHarga(), kategori=Data.daftarKategori?Data.daftarKategori():[];
  var cari=document.getElementById("cari-harga"), pilih=document.getElementById("kategori-harga"),
      urut=document.getElementById("urut-harga"), wadah=document.getElementById("kartu-harga"),
      hasil=document.getElementById("hasil-harga");

  // Isi filter kategori dari sumber data yang sama dengan kartu harga.
  if(pilih){
    kategori.forEach(function(k){
      var o=document.createElement("option"); o.value=k.id; o.textContent=k.nama; pilih.appendChild(o);
    });
  }

  function render(){
    var q=(cari.value||"").trim().toLowerCase(), k=pilih.value, mode=urut.value;
    var data=semua.filter(function(x){return (!k||String(x.kategori).toLowerCase()===String(k).toLowerCase())&&(!q||x.jenis.toLowerCase().indexOf(q)>-1);});
    data.sort(function(a,b){
      if(mode==="tinggi")return b.harga-a.harga;
      if(mode==="rendah")return a.harga-b.harga;
      return a.jenis.localeCompare(b.jenis);
    });
    wadah.replaceChildren();
    data.forEach(function(x){
      var kartu=document.createElement("article");kartu.className="kartu-harga-item";
      var label=document.createElement("p");label.className="kartu-harga-label";label.textContent=x.kategori;
      var judul=document.createElement("h2");judul.textContent=x.jenis;
      var nilai=document.createElement("p");nilai.className="kartu-harga-nilai angka";nilai.textContent=Data.formatRupiah(x.harga);
      var sat=document.createElement("p");sat.className="kartu-harga-satuan";sat.textContent="per "+x.satuan;
      var ket=document.createElement("p");ket.className="kartu-harga-ket";ket.textContent=x.keterangan;
      kartu.append(label,judul,nilai,sat,ket);wadah.appendChild(kartu);
    });
    hasil.textContent=data.length?data.length+" jenis sampah ditemukan.":"Tidak ada material dengan harga untuk filter ini.";
  }
  [cari,pilih,urut].forEach(function(el){if(!el)return;el.addEventListener("input",render);el.addEventListener("change",render);});
  render();
 });
})();
