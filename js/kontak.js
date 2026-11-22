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

    function tulis(el, pesan) { if (el) el.textContent = pesan; }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nama = nameInput ? nameInput.value.trim() : "";
      const kontak = emailInput ? emailInput.value.trim() : "";
      const pesan = messageInput ? messageInput.value.trim() : "";

      tulis(errorNama, nama ? "" : "Nama wajib diisi.");
      tulis(errorEmail, kontak ? "" : "Email atau kontak wajib diisi.");
      tulis(errorPesan, pesan ? "" : "Pesan wajib diisi.");

      if (!nama || !kontak || !pesan) {
        if (sukses) sukses.hidden = true;
        if (!nama && nameInput) nameInput.focus();
        else if (!kontak && emailInput) emailInput.focus();
        else if (messageInput) messageInput.focus();
        return;
      }

      if (sukses) {
        sukses.textContent = "Terima kasih, " + nama + "! Pesan Anda telah terkirim ke Pos Utama BankSampahKu. Tim kami akan segera menghubungi Anda.";
        sukses.hidden = false;
      }
      contactForm.reset();
    });
  }

  // Pembesar foto galeri (lightbox)
  const galleryImages = document.querySelectorAll(".gallery-item img");

  if (galleryImages.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.id = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Foto galeri");
    lightbox.tabIndex = -1;
    lightbox.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 20px;
      cursor: zoom-out;
    `;

    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "";
    lightboxImg.style.cssText = `
      max-width: 90%;
      max-height: 80vh;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      object-fit: contain;
    `;

    const lightboxCaption = document.createElement("p");
    lightboxCaption.style.cssText = `
      color: var(--video-teks);
      margin-top: 12px;
      font-size: 1rem;
      text-align: center;
    `;

    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(lightboxCaption);
    document.body.appendChild(lightbox);

    let pemicuTerakhir = null;

    function tutup() {
      lightbox.style.display = "none";
      lightboxImg.removeAttribute("src");
      if (pemicuTerakhir && typeof pemicuTerakhir.focus === "function") pemicuTerakhir.focus();
    }

    galleryImages.forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        pemicuTerakhir = img;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightbox.style.display = "flex";
        lightbox.focus();
      });
    });

    lightbox.addEventListener("click", tutup);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.style.display === "flex") {
        e.preventDefault();
        tutup();
      }
    });
  }
});
