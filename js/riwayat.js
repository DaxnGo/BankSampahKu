// Riwayat Setoran — halaman Warga (read-only).
(function(){
 "use strict";
 document.addEventListener("DOMContentLoaded",function(){
  var sesi=window.BankAuth&&window.BankAuth.sesi(); if(!sesi||sesi.user.peran!=="warga")return;
  var Data=window.BankData, semua=Data.riwayatLengkapWarga(sesi.user.id);
  var cari=document.getElementById("cari-riwayat"), periode=document.getElementById("periode-riwayat"),
      jenis=document.getElementById("jenis-riwayat"), badan=document.getElementById("badan-riwayat-lengkap"),
      hasil=document.getElementById("hasil-riwayat"), kosong=document.getElementById("kosong-riwayat"),
      paginasi=document.getElementById("paginasi-riwayat"), dialog=document.getElementById("detail-riwayat");
  var HAL=8, halaman=1, tersaring=semua;

  function isiPeriode(){
   var bulan={}; semua.forEach(function(x){bulan[String(x.tanggal).slice(0,7)]=1;});
   Object.keys(bulan).sort().reverse().forEach(function(b){
    var o=document.createElement("option"); o.value=b; o.textContent=Data.namaBulan(b); periode.appendChild(o);
   });
  }
  function isiJenis(){
   Data.daftarJenis.forEach(function(j){var o=document.createElement("option");o.value=j;o.textContent=j;jenis.appendChild(o);});
  }
  function terfilter(){
   var q=(cari.value||"").trim().toLowerCase(), p=periode.value, j=jenis.value;
   return semua.filter(function(x){
    return (!p||p==="semua"||String(x.tanggal).indexOf(p)===0)&&(!j||x.jenis===j)&&(!q||x.jenis.toLowerCase().indexOf(q)>-1);
   });
  }
  function baris(x){
   var tr=document.createElement("tr");
   var tgl=document.createElement("td"), w=document.createElement("time");
   w.setAttribute("datetime",x.tanggal); w.textContent=Data.formatTanggal(x.tanggal); tgl.appendChild(w);
   var jns=document.createElement("td"); jns.textContent=x.jenis;
   var brt=document.createElement("td"); brt.className="angka"; brt.textContent=Data.formatAngka(x.berat)+" kg";
   var hr=document.createElement("td"); hr.className="angka"; hr.textContent=Data.formatRupiah(x.hargaPerKg);
   var n=document.createElement("td"); n.className="angka"; n.textContent=Data.formatRupiah(x.nilai);
   var a=document.createElement("td"), b=document.createElement("button");
   b.type="button"; b.className="tombol-detail"; b.textContent="Detail";
   b.setAttribute("aria-label","Detail setoran "+Data.formatTanggal(x.tanggal));
   b.addEventListener("click",function(){tampilDetail(x);}); a.appendChild(b);
   tr.append(tgl,jns,brt,hr,n,a); return tr;
  }
  function tampilDetail(x){
   var isi=document.getElementById("detail-riwayat-isi"); isi.replaceChildren();
   [["Tanggal",Data.formatTanggal(x.tanggal)],["Jenis sampah",x.jenis],["Berat",Data.formatAngka(x.berat)+" kg"],
    ["Harga per kg",Data.formatRupiah(x.hargaPerKg)],["Total nilai",Data.formatRupiah(x.nilai)],["RT",x.rt],
    ["Status","Tercatat di buku tabungan"]].forEach(function(p){
    var dt=document.createElement("dt");dt.textContent=p[0];var dd=document.createElement("dd");dd.textContent=p[1];isi.append(dt,dd);
   });
   if(dialog.showModal)dialog.showModal(); else dialog.setAttribute("open","");
  }
  function render(){
   tersaring=terfilter(); var total=Math.max(1,Math.ceil(tersaring.length/HAL));
   if(halaman>total)halaman=total;
   var mulai=(halaman-1)*HAL, akhir=mulai+HAL;
   badan.replaceChildren(); tersaring.slice(mulai,akhir).forEach(function(x){badan.appendChild(baris(x));});
   kosong.hidden=tersaring.length>0;
   hasil.textContent=tersaring.length?"Menampilkan "+(mulai+1)+"–"+Math.min(akhir,tersaring.length)+" dari "+tersaring.length+" transaksi":"Tidak ada transaksi yang cocok.";
   paginasi.replaceChildren();
   if(tersaring.length>HAL){
    [-1,1].forEach(function(langkah){
     var b=document.createElement("button");b.type="button";b.textContent=langkah<0?"Sebelumnya":"Berikutnya";
     b.disabled=langkah<0?halaman===1:halaman===total;
     b.addEventListener("click",function(){halaman+=langkah;render();});paginasi.appendChild(b);
    });
    var l=document.createElement("span");l.textContent="Halaman "+halaman+" / "+total;paginasi.appendChild(l);
   }
  }
  [cari,jenis,periode].forEach(function(el){el.addEventListener("input",function(){halaman=1;render();});el.addEventListener("change",function(){halaman=1;render();});});
  var tutup=document.querySelector("[data-tutup-detail]");if(tutup)tutup.addEventListener("click",function(){dialog.close?dialog.close():dialog.removeAttribute("open");});
  dialog.addEventListener("click",function(e){if(e.target===dialog){dialog.close?dialog.close():dialog.removeAttribute("open");}});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&dialog.open){dialog.close?dialog.close():dialog.removeAttribute("open");}});
  isiPeriode(); isiJenis(); render();
 });
})();
