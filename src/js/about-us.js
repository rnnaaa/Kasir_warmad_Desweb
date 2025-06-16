document.addEventListener("DOMContentLoaded", function () {
  // Animasi scroll
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".about-content, .testimonial-card");
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementPosition < windowHeight - 100) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Set initial state untuk animasi
  const elements = document.querySelectorAll(".about-content, .testimonial-card");
  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Trigger once on load

  // Fungsi keranjang belanja
  function initCart() {
    // Pastikan cart-button ada di halaman ini
    const cartButton = document.querySelector(".cart-button");
    if (!cartButton) return;

    // Inisialisasi keranjang jika belum ada
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }

    // Fungsi untuk update tampilan keranjang
    function updateCartDisplay() {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCount = cartButton.querySelector(".cart-count") || document.createElement("span");

        // Hitung total item
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);

        if (totalItems > 0) {
          // Jika ada item di keranjang
          cartCount.className = "cart-count";
          cartCount.textContent = totalItems > 9 ? "9+" : totalItems;
          if (!cartButton.contains(cartCount)) {
            cartButton.appendChild(cartCount);
          }
          cartButton.style.position = "relative"; // Pastikan posisi relatif
        } else {
          // Jika keranjang kosong
          const existingCount = cartButton.querySelector(".cart-count");
          if (existingCount) {
            cartButton.removeChild(existingCount);
          }
        }
      } catch (e) {
        console.error("Error updating cart display:", e);
      }
    }

    // Panggil fungsi update saat halaman dimuat
    updateCartDisplay();

    // Tambahkan event listener untuk tombol keranjang
    cartButton.addEventListener("click", function () {
      // Arahkan ke halaman menu dengan menampilkan keranjang
      window.location.href = "./menu.html#cart";
    });

    // Tambahkan event listener untuk perubahan storage (untuk update real-time jika tab lain berubah)
    window.addEventListener("storage", updateCartDisplay);
  }

  // Panggil fungsi initCart
  initCart();
});
