document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector(".contact-form form") || document.querySelector("form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameInput = contactForm.querySelector('input[type="text"]');
      const emailInput = contactForm.querySelector('input[type="email"], input[type="tel"]');
      const messageInput = contactForm.querySelector("textarea");

      const nama = nameInput ? nameInput.value.trim() : "";
      const kontak = emailInput ? emailInput.value.trim() : "";
      const pesan = messageInput ? messageInput.value.trim() : "";

      if (!nama || !kontak || !pesan) {
        alert("Harap lengkapi semua kolom (Nama, Kontak, dan Pesan) sebelum mengirim.");
        return;
      }

      alert(
        "Terima kasih, " +
          nama +
          "! Pesan Anda telah terkirim ke Pos Utama BankSampahKu. Tim kami akan segera menghubungi Anda."
      );
      contactForm.reset();
    });
  }

  // Pembesar foto galeri(Lightbox)
  const galleryImages = document.querySelectorAll(".gallery-item img");

  if (galleryImages.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.id = "gallery-lightbox";
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
    lightboxImg.style.cssText = `
      max-width: 90%;
      max-height: 80vh;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      object-fit: contain;
    `;

    const lightboxCaption = document.createElement("p");
    lightboxCaption.style.cssText = `
      color: #F2EFE0;
      margin-top: 12px;
      font-size: 1rem;
      text-align: center;
    `;

    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(lightboxCaption);
    document.body.appendChild(lightbox);

    galleryImages.forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
        lightbox.style.display = "flex";
      });
    });

    lightbox.addEventListener("click", function () {
      lightbox.style.display = "none";
    });
  }
});
