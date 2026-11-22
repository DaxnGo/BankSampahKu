// Harga Sampah — data harga + klasifikasi kategori dari BankData.
(function(){
 "use strict";
 document.addEventListener("DOMContentLoaded",function(){
  var sesi=window.BankAuth&&window.BankAuth.sesi(); if(!sesi)return;
  var Data=window.BankData;
  var semua=Data.daftarHarga(), kategori=Data.daftarKategori?Data.daftarKategori():[];
  var cari=document.getElementById("cari-harga"), pilih=document.getElementById("kategori-harga"),
      urut=document.getElementById("urut-harga"), wadah=document.getElementById("kartu-harga"),
      hasil=document.getElementById("hasil-harga"), grid=document.getElementById("kategori-grid");

  // Isi filter kategori dari sumber data yang sama dengan kartu edukasi.
  if(pilih){
    kategori.forEach(function(k){
      var o=document.createElement("option"); o.value=k.id; o.textContent=k.nama; pilih.appendChild(o);
    });
  }

  const IKON={
    leaf:'<path d="M5 19C5 9 11 4 20 4c0 10-5 15-14 15Z"/><path d="M5 19c4-5 8-8 12-10"/>',
    recycle:'<path d="M7 8 4 13l3 5h6"/><path d="m17 8 3 5-3 5h-6"/><path d="M9 5h4l2 3m-4 11h4"/>',
    alert:'<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5m0 3h.01"/>'
  };
  function svg(nama){
    return '<svg class="ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IKON[nama]||IKON.leaf)+'</svg>';
  }

  function kartuKategori(k){
    var kartu=document.createElement("article");
    kartu.className="kartu-kategori-item kategori-"+k.id;
    var ikon=document.createElement("div"); ikon.className="kategori-ikon"; ikon.setAttribute("aria-hidden","true"); ikon.innerHTML=svg(k.ikon);
    var judul=document.createElement("h3"); judul.textContent=k.nama;
    var des=document.createElement("p"); des.className="kategori-deskripsi"; des.textContent=k.deskripsi;
    var label=document.createElement("h4"); label.textContent="Contoh";
    var daftar=document.createElement("ul"); k.contoh.forEach(function(c){var li=document.createElement("li");li.textContent=c;daftar.appendChild(li);});
    var label2=document.createElement("h4"); label2.textContent="Penanganan";
    var pen=document.createElement("p"); pen.className="kategori-penanganan"; pen.textContent=k.penanganan;
    var status=document.createElement("p"); status.className="kategori-status";
    status.textContent=k.memilikiHarga?"Memiliki harga setoran.":"Belum tersedia informasi harga setoran untuk kategori ini.";
    kartu.append(ikon,judul,des,label,daftar,label2,pen,status); return kartu;
  }
  if(grid){ grid.replaceChildren(); kategori.forEach(function(k){grid.appendChild(kartuKategori(k));}); }

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
    var info=document.getElementById("harga-tanpa-harga");
    if(info) info.hidden=!(data.length===0&&(k==="organik"||k==="b3"));
    hasil.textContent=data.length?data.length+" jenis sampah ditemukan.":"Tidak ada material dengan harga untuk filter ini.";
  }
  [cari,pilih,urut].forEach(function(el){if(!el)return;el.addEventListener("input",render);el.addEventListener("change",render);});
  render();
 });
})();
