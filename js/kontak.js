// File   : js/kontak.js
// Tujuan : Validasi formulir kontak dan pembesar foto galeri.

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"], input[type="tel"]');
    const messageInput = contactForm.querySelector("textarea");
    const errorNama = document.getElementById("error-nama");
    const errorEmail = document.getElementById("error-email");
    const errorPesan = document.getElementById("error-pesan");
    const sukses = document.getElementById("formSuccess");
    contactForm.querySelector('[type="submit"]').disabled = false;

    function tampilkanError(kolom, elemen, teks) {
      elemen.textContent = teks;
      if (teks) kolom.setAttribute("aria-invalid", "true");
      else kolom.removeAttribute("aria-invalid");
    }

    [[nameInput, errorNama], [emailInput, errorEmail], [messageInput, errorPesan]].forEach(function ([kolom, error]) {
      kolom.addEventListener("input", function () {
        tampilkanError(kolom, error, "");
        sukses.hidden = true;
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nama = nameInput ? nameInput.value.trim() : "";
      const pesan = messageInput ? messageInput.value.trim() : "";
      if (emailInput) emailInput.value = emailInput.value.trim();

      tampilkanError(nameInput, errorNama, nama ? "" : "Nama wajib diisi.");
      const emailValid = emailInput && emailInput.checkValidity();
      tampilkanError(emailInput, errorEmail, emailValid ? "" : "Masukkan alamat email yang valid.");
      tampilkanError(messageInput, errorPesan, pesan ? "" : "Pesan wajib diisi.");

      if (!nama || !emailValid || !pesan) {
        if (sukses) sukses.hidden = true;
        if (!nama && nameInput) nameInput.focus();
        else if (!emailValid && emailInput) emailInput.focus();
        else if (messageInput) messageInput.focus();
        return;
      }

      if (sukses) {
        sukses.textContent = "Simulasi berhasil: isian valid, tetapi pesan tidak dikirim karena belum ada layanan pengirim.";
        sukses.hidden = false;
      }
      contactForm.reset();
    });
  }

  const lightbox = document.getElementById("gallery-lightbox");
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector("img");
  const caption = lightbox.querySelector("p");
  let pemicuTerakhir;

  document.querySelectorAll(".gallery-item button").forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      const foto = tombol.querySelector("img");
      const teks = tombol.closest("figure").querySelector("figcaption").textContent;
      pemicuTerakhir = tombol;
      lightboxImg.src = foto.src;
      lightboxImg.alt = foto.alt;
      caption.textContent = teks;
      lightbox.showModal();
    });
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("close", function () {
    lightboxImg.removeAttribute("src");
    if (pemicuTerakhir) pemicuTerakhir.focus();
  });
});
