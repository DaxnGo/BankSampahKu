// Profil — hanya menampilkan data akun dari sesi, tanpa fitur edit palsu.
(function(){
 "use strict";
 document.addEventListener("DOMContentLoaded",function(){
  var sesi=window.BankAuth&&window.BankAuth.sesi(); if(!sesi)return;
  var u=sesi.user, Data=window.BankData;
  document.getElementById("profil-nama").textContent=u.nama;
  document.getElementById("profil-avatar").textContent=Data.inisialNama(u.nama);
  document.getElementById("profil-peran").textContent=u.peran==="petugas"?"Petugas Bank Sampah":"Warga Bank Sampah";
  var pasangan=[["Username",u.username],["Kode nasabah",u.kode||"—"],["Role",u.peran==="petugas"?"Petugas":"Warga"],["RT",u.rt||"—"]];
  var dl=document.getElementById("profil-data");
  pasangan.forEach(function(p){
   var dt=document.createElement("dt");dt.textContent=p[0];
   var dd=document.createElement("dd");dd.textContent=p[1];dl.append(dt,dd);
  });
 });
})();
