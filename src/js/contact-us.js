document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.querySelector(".submit-btn"); // Ubah selector ke .submit-btn

  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Ambil nilai dari form - sesuaikan selector dengan struktur HTML Anda
      const name = document.querySelector('input[type="text"]').value.trim();
      const email = document.querySelector('input[type="email"]').value.trim();
      const message = document.querySelector("textarea").value.trim();

      // Validasi field
      if (!name || !email || !message) {
        alert("Harap isi semua field terlebih dahulu!");
        return;
      }

      // Format pesan WhatsApp
      const whatsappMsg = `Halo Warung Madura!%0A%0ANama: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0APesan:%0A${encodeURIComponent(message)}`;

      // Nomor WhatsApp (format 628...)
      const phone = "6289677555394";

      // Buka WhatsApp
      window.open(`https://wa.me/${phone}?text=${whatsappMsg}`, "_blank");
    });
  } else {
    console.error("Tombol submit tidak ditemukan!");
  }
});
