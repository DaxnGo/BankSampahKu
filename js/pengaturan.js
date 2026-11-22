// Pengaturan — preferensi tema saja; tombol ikut logika js/tema.js.
(function(){
 "use strict";
  function setHidden(el, nilai) {
    if (!el) return;
    if (nilai) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

 document.addEventListener("DOMContentLoaded",function(){
  var tombol=document.getElementById("pengaturan-tema");
  if(!tombol)return;
  function sinkron(){
   var gelap=document.documentElement.getAttribute("data-tema")==="gelap";
   var bulan=tombol.querySelector(".ikon-bulan"), matahari=tombol.querySelector(".ikon-matahari");
   setHidden(bulan, gelap); setHidden(matahari, !gelap);
   tombol.setAttribute("aria-label",gelap?"Gunakan mode terang":"Gunakan mode gelap");
  }
  tombol.addEventListener("click",function(){
   var gelap=document.documentElement.getAttribute("data-tema")==="gelap";
   var berikut=gelap?"terang":"gelap";
   document.documentElement.setAttribute("data-tema",berikut);
   try{localStorage.setItem("banksampahku.tema",berikut);}catch(e){}
   document.getElementById("warna-tema").setAttribute("content",berikut==="gelap"?"#101c18":"#FBF6EC");
   sinkron();

   var dev = false;
   try { dev = localStorage.getItem("banksampahku.dev") === "1"; } catch (e) {}
   if (dev) document.body.classList.add("dev-mode");

   var reset = document.getElementById("reset-data");
   if (reset) {
     reset.addEventListener("click", function () {
       if (!window.BankData) return;
       window.BankData.resetData();
       var notif = document.getElementById("pesan-reset");
       if (notif) notif.textContent = "Data contoh awal dikembalikan.";
     });
   }
  });
  sinkron();
 });
})();
