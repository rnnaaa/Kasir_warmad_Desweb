document.addEventListener("DOMContentLoaded", function () {
  // ========================
  // BAGIAN NAVBAR
  // ========================
  function loadNavbar() {
    fetch("./src/components/navbar/navbar.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("navbar").innerHTML = data;
        addActiveClass();
        setupToggleButton();
        setupScrollBehavior();
      })
      .catch((error) => console.log("Error loading navbar:", error));
  }

  function addActiveClass() {
    var currentLocation = window.location.href;
    var navLinks = document.querySelectorAll("#navbar a");

    navLinks.forEach(function (link) {
      if (link.href === currentLocation) {
        link.classList.add("active");
      }
    });
  }

  function setupToggleButton() {
    const mobileMenu = document.querySelector("header nav .mobile-menu");
    const menu = document.querySelector("header nav .menu");
    mobileMenu.addEventListener("click", function () {
      menu.classList.toggle("show");
    });

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !mobileMenu.contains(event.target)) {
        menu.classList.remove("show");
      }
    });
  }

  function setupScrollBehavior() {
    const header = document.querySelector("header");
    window.onscroll = function () {
      if (document.documentElement.scrollTop >= 200) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
  }
  loadNavbar();

  // ========================
  // BAGIAN FILTER PRODUK
  // ========================
  document.querySelector(".tab").innerHTML = `<p class="all">All Menu</p>${[...new Set([...document.querySelectorAll(".category")].map((c) => `<p class="${c.textContent.toLowerCase().replace(" ", "")}">${c.textContent}</p>`))].join("")}`;

  const products = document.querySelectorAll(".product");
  products.forEach((product) => {
    const category = product.querySelector(".category");
    const categoryText = category.innerText.toLowerCase().replace(" ", "");
    product.classList.add(categoryText);
  });

  const tabs = document.querySelectorAll(".tab > p");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      if (!this.classList.contains("active")) {
        tabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        const tabClass = this.className;
        products.forEach((product) => {
          product.style.display = tabClass === "all" || product.classList.contains(tabClass) ? "block" : "none";
        });
      }
    });
  });

  tabs[0].classList.add("active");

  // ========================
  // BAGIAN POPUP PRODUK
  // ========================
  products.forEach((product) => {
    product.addEventListener("click", () => {
      const clonedProduct = product.cloneNode(true);
      const elementsToRemove = clonedProduct.querySelectorAll(".size, .ice, .sugar");
      elementsToRemove.forEach((el) => el.remove());

      const popup = document.querySelector(".popup");
      const overlay = document.querySelector(".overlay");

      popup.innerHTML = "";
      popup.appendChild(clonedProduct);

      const priceElement = popup.querySelector(".price");
      priceElement.insertAdjacentHTML(
        "beforebegin",
        `
        <div class="amount">
          <span>Jumlah</span>
          <div class="number">
            <div class="minus" onclick="decreaseValue()"><i class="fas fa-minus"></i></div>
            <div class="value"><input id="product-amount" value="1"/></div>
            <div class="plus" onclick="increaseValue()"><i class="fas fa-plus"></i></div>
          </div>
        </div>
      `
      );

      const productWrap = popup.querySelector(".product-wrap");
      if (productWrap) {
        productWrap.insertAdjacentHTML(
          "beforeend",
          `
          <div onclick="addToCart()" class="add">
            <span>Tambah ke Keranjang</span>
            <i class="fas fa-cart-plus"></i>
          </div>
          <div class="close-pop" onclick="closePopup()">
            <i class="fas fa-times"></i>
          </div>
        `
        );
      }

      popup.classList.add("show");
      overlay.classList.add("show");
      document.body.classList.add("ov");
    });
  });

  // ========================
  // BAGIAN KERANJANG
  // ========================

  function displayCartModal() {
    const modal = document.getElementById("cartModal");
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const container = document.getElementById("cartItemsContainer");

    container.innerHTML = "";

    if (cartItems.length === 0) {
      container.innerHTML = '<div class="empty-cart">Keranjang kosong</div>';
      document.getElementById("total-price").textContent = "Rp 0";
      document.getElementById("checkout-btn").disabled = true;
      modal.style.display = "flex";
      return;
    }

    cartItems.forEach((item) => {
      const price = item.originalPrice || parseInt(item.price.replace(/\D/g, "")) || 0;
      const quantity = item.quantity || 1;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.dataset.id = item.id;
      itemElement.innerHTML = `
      <div class="item-checkbox">
        <input type="checkbox" class="item-select" data-id="${item.id}">
      </div>
      <div class="item-details">
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="item-price">Rp ${price.toLocaleString("id-ID")}</p>
          <p class="item-quantity">Jumlah: ${quantity}</p>
        </div>
      </div>
      <div class="item-actions">
        <div class="quantity-control">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span class="quantity">${quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

      container.appendChild(itemElement);
    });

    // Update total awal (0 karena belum ada yang dicentang)
    document.getElementById("total-price").textContent = "Rp 0";
    document.getElementById("checkout-btn").disabled = false;
    modal.style.display = "flex";

    // Tambahkan event listener untuk checkbox
    document.querySelectorAll(".item-select").forEach((checkbox) => {
      checkbox.addEventListener("change", updateTotalPrice);
    });
  }

  function updateTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let total = 0;

    document.querySelectorAll(".item-select").forEach((checkbox) => {
      if (checkbox.checked) {
        const itemId = checkbox.dataset.id;
        const item = cartItems.find((i) => i.id === itemId);
        if (item) {
          total += (item.originalPrice || parseInt(item.price.replace(/\D/g, ""))) * (item.quantity || 1);
        }
      }
    });

    document.getElementById("total-price").textContent = "Rp " + total.toLocaleString("id-ID");
  }

  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = cartItems.length;
    }
  }

  document.querySelector(".cart-button").addEventListener("click", displayCartModal);
  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("cartModal").style.display = "none";
  });

  document.getElementById("cartItemsContainer").addEventListener("click", (e) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const target = e.target.closest(".minus, .plus, .remove-btn");
    if (!target) return;

    const itemId = target.dataset.id;
    const itemIndex = cartItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    if (target.classList.contains("minus")) {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity--;
      }
    } else if (target.classList.contains("plus")) {
      cartItems[itemIndex].quantity++;
    } else if (target.classList.contains("remove-btn")) {
      cartItems.splice(itemIndex, 1);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
    displayCartModal();
  });
  // GANTI BAGIAN CHECKOUT DENGAN INI
  document.getElementById("checkout-btn").addEventListener("click", function () {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const checkedItems = [];
    const remainingItems = [];
    let totalCheckout = 0;

    // Pisahkan item yang dicentang dan tidak
    document.querySelectorAll(".item-select:checked").forEach((checkbox) => {
      const itemId = checkbox.dataset.id;
      const itemIndex = cartItems.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        const item = cartItems[itemIndex];
        checkedItems.push(item);
        totalCheckout += (item.originalPrice || parseInt(item.price.replace(/\D/g, ""))) * (item.quantity || 1);
      }
    });

    // Siapkan item yang tidak dicentang untuk disimpan kembali
    cartItems.forEach((item) => {
      if (!checkedItems.some((checkedItem) => checkedItem.id === item.id)) {
        remainingItems.push(item);
      }
    });

    // Simpan ke localStorage
    localStorage.setItem("cartItems", JSON.stringify(remainingItems));

    // Update tampilan
    updateCartCount();

    // Tutup modal atau refresh
    if (remainingItems.length > 0) {
      displayCartModal();
    } else {
      document.getElementById("cartModal").style.display = "none";
      // Tambahkan ini untuk memastikan keranjang benar-benar kosong
      document.getElementById("cartItemsContainer").innerHTML = '<div class="empty-cart">Keranjang kosong</div>';
      document.getElementById("total-price").textContent = "Rp 0";
      document.getElementById("checkout-btn").disabled = true;
    }
  });

  // FUNGSI GLOBAL
  // ========================
  window.addToCart = function () {
    const popup = document.querySelector(".popup.show");
    if (!popup) return;

    const productName = popup.querySelector("h3")?.textContent || "Product";
    const productImage = popup.querySelector(".img img")?.src || "";
    const productQuantity = parseInt(popup.querySelector("#product-amount")?.value) || 1;
    const originalPrice = parseInt(popup.querySelector(".price")?.textContent.replace(/\D/g, "")) || 0;
    const productPrice = "Rp " + (originalPrice * productQuantity).toLocaleString("id-ID");

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingProductIndex = cartItems.findIndex((item) => item.name === productName && item.image === productImage && item.originalPrice === originalPrice);

    if (existingProductIndex !== -1) {
      cartItems[existingProductIndex].quantity += productQuantity;
    } else {
      cartItems.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: productQuantity,
        originalPrice: originalPrice,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();

    alert("Produk ditambahkan ke keranjang!");
    closePopup();
  };

  window.closePopup = function () {
    document.querySelector(".popup").classList.remove("show");
    document.querySelector(".overlay").classList.remove("show");
    document.body.classList.remove("ov");
  };

  window.decreaseValue = function () {
    const input = document.querySelector(".popup.show #product-amount");
    if (!input) return;
    let value = parseInt(input.value);
    if (value > 1) input.value = value - 1;
  };

  window.increaseValue = function () {
    const input = document.querySelector(".popup.show #product-amount");
    if (!input) return;
    input.value = parseInt(input.value) + 1;
  };

  updateCartCount();
});
