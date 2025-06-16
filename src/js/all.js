// Gabungkan event listener DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  document.querySelector(".mobile-nav").addEventListener("click", () => {
    document.querySelector("header nav").classList.toggle("show");
  });

  // Initialize cart count
  updateCartCount();

  // Dropdown functionality
  const dropbtn = document.getElementById("dropbtn");
  const dropdownContent = document.getElementById("dropdown-content");

  if (dropbtn && dropdownContent) {
    dropbtn.addEventListener("click", function () {
      dropdownContent.style.display = "block";
    });

    dropdownContent.addEventListener("click", function (event) {
      dropbtn.textContent = event.target.getAttribute("data-value");
      dropdownContent.style.display = "none";
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener("click", function (event) {
      if (!event.target.matches("#dropbtn")) {
        if (dropdownContent.style.display == "block") {
          dropdownContent.style.display = "none";
        }
      }
    });
  }
});

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }
}

// Modals function
const cartButton = document.querySelector(".cart-button");
if (cartButton) {
  cartButton.addEventListener("click", displayCartModal);
}

const modal = document.getElementById("cartModal");
const closeButton = document.querySelector(".close");

if (closeButton) {
  closeButton.addEventListener("click", closeModal);
}

function displayCartModal() {
  const totalPriceElement = document.getElementById("total-price");
  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsContainer = document.getElementById("cartItemsContainer");

  if (!totalPriceElement || !cartItemsContainer) return;

  let totalPriceAllItems = 0;
  cartItemsContainer.innerHTML = "";

  if (cartItemsData.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
    totalPriceElement.textContent = "Rp 0";
    openModal();
    return;
  }

  cartItemsData.forEach((item, index) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");

    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("item-details");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("item-image");
    const itemImage = document.createElement("img");
    itemImage.src = item.image;
    imageContainer.appendChild(itemImage);

    const itemText = document.createElement("div");
    itemText.classList.add("item");

    const itemName = document.createElement("h5");
    itemName.textContent = item.name;

    const itemDescription = document.createElement("div");
    itemDescription.classList.add("item-description");

    const itemSize = document.createElement("p");
    itemSize.textContent = "Size : " + item.size;
    const itemType = document.createElement("p");
    itemType.textContent = "Ice : " + item.type;
    const itemSugar = document.createElement("p");
    itemSugar.textContent = "Sugar : " + item.sugar;

    itemDescription.appendChild(itemSize);
    itemDescription.appendChild(itemType);
    itemDescription.appendChild(itemSugar);

    const itemPrice = document.createElement("p");
    itemPrice.textContent = item.price;
    itemPrice.classList.add(`item-price-${index}`);
    itemPrice.setAttribute("value", item.originalPrice);

    itemText.appendChild(itemName);
    itemText.appendChild(itemDescription);
    itemText.appendChild(itemPrice);

    detailsContainer.appendChild(imageContainer);
    detailsContainer.appendChild(itemText);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("delete-container");
    deleteContainer.onclick = () => {
      deleteCartItem(index);
    };

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fas", "fa-trash");
    deleteContainer.appendChild(deleteButton);

    const quantity = document.createElement("div");
    quantity.classList.add("item-quantity");

    const minusButton = document.createElement("div");
    minusButton.classList.add("minus");
    minusButton.onclick = () => decreaseValue(index);
    minusButton.innerHTML = '<i class="fas fa-minus"></i>';

    const inputField = document.createElement("div");
    inputField.classList.add("value");
    const inputElement = document.createElement("input");
    inputElement.id = `product-amount-${index}`;
    inputElement.value = item.quantity || 1;
    inputField.appendChild(inputElement);

    const plusButton = document.createElement("div");
    plusButton.classList.add("plus");
    plusButton.onclick = () => increaseValue(index);
    plusButton.innerHTML = '<i class="fas fa-plus"></i>';

    quantity.appendChild(minusButton);
    quantity.appendChild(inputField);
    quantity.appendChild(plusButton);

    buttonContainer.appendChild(quantity);
    buttonContainer.appendChild(deleteContainer);

    itemContainer.appendChild(detailsContainer);
    itemContainer.appendChild(buttonContainer);
    cartItemsContainer.appendChild(itemContainer);

    totalPriceAllItems += parseInt(item.originalPrice) * (item.quantity || 1);

    function decreaseValue(index) {
      const inputElement = document.getElementById(`product-amount-${index}`);
      let currentValue = parseInt(inputElement.value);
      if (currentValue > 1) {
        currentValue--;
        inputElement.value = currentValue;
        cartItemsData[index].quantity = currentValue;
        updatePrice(index, currentValue);
      }
    }

    function increaseValue(index) {
      const inputElement = document.getElementById(`product-amount-${index}`);
      let currentValue = parseInt(inputElement.value);
      currentValue++;
      inputElement.value = currentValue;
      cartItemsData[index].quantity = currentValue;
      updatePrice(index, currentValue);
    }

    function updatePrice(index, quantity) {
      const priceElement = document.querySelector(`.item-price-${index}`);
      const price = parseInt(priceElement.getAttribute("value"));
      const totalPrice = price * quantity;

      priceElement.textContent = "Rp " + totalPrice.toLocaleString("id-ID");
      cartItemsData[index].price = "Rp " + totalPrice.toLocaleString("id-ID");
      localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
      updateTotalPrice();
    }
  });

  function updateTotalPrice() {
    const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
    totalPriceAllItems = cartItemsData.reduce((total, item) => {
      return total + item.originalPrice * (item.quantity || 1);
    }, 0);
    totalPriceElement.textContent = "Rp " + totalPriceAllItems.toLocaleString("id-ID");
  }

  totalPriceElement.textContent = "Rp " + totalPriceAllItems.toLocaleString("id-ID");
  openModal();
}

function deleteCartItem(index) {
  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemsData.splice(index, 1);
  localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
  displayCartModal();
  updateCartCount();
}

function closeModal() {
  const modal = document.getElementById("cartModal");
  if (modal) modal.style.display = "none";
}

function openModal() {
  const modal = document.getElementById("cartModal");
  if (modal) modal.style.display = "flex";
}

// Checkout button
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItemsData.length === 0) {
      alert("Keranjang kosong! Silakan tambahkan item terlebih dahulu.");
      return;
    }

    alert("Terima kasih! Pesanan Anda sedang diproses.");
    localStorage.removeItem("cartItems");
    closeModal();
    updateCartCount();

    // Refresh cart display
    displayCartModal();
  });
}
