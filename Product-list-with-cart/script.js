const desserts = [
  { id: 1, name: "Waffle with Berries", price: 6.5, img: "images/waffle.jpg" },
  { id: 2, name: "Vanilla Bean Crème Brûlée", price: 7.0, img: "images/creme.jpg" },
  { id: 3, name: "Macaron Mix of Five", price: 8.0, img: "images/macaron.jpg" },
  { id: 4, name: "Classic Tiramisu", price: 5.5, img: "images/tiramisu.jpg" },
  { id: 5, name: "Pistachio Baklava", price: 4.0, img: "images/baklava.jpg" },
  { id: 6, name: "Lemon Meringue Pie", price: 5.0, img: "images/meringue.jpg" },
  { id: 7, name: "Red Velvet Cake", price: 4.5, img: "images/cake.jpg" },
  { id: 8, name: "Salted Caramel Brownie", price: 5.5, img: "images/brownie.jpg" },
  { id: 9, name: "Vanilla Panna Cotta", price: 6.5, img: "images/panna.jpg" },
];

const dessertList = document.getElementById("dessertList");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const orderTotal = document.getElementById("orderTotal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const modal = document.getElementById("orderModal");
const modalItems = document.getElementById("modalItems");
const modalTotal = document.getElementById("modalTotal");
const newOrderBtn = document.getElementById("newOrderBtn");
const cartSummary = document.querySelector(".cart-summary");

let cart = [];

// --- Display Desserts ---
desserts.forEach((dessert) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${dessert.img}" alt="${dessert.name}">
    <button class="add-btn" id="add-btn-${dessert.id}" onclick="addToCart(${dessert.id})">Add to Cart</button>
    <h3>${dessert.name}</h3>
    <p class="price">$${dessert.price.toFixed(2)}</p>
  `;
  dessertList.appendChild(card);
});

// --- Add to Cart ---
function addToCart(id) {
  const item = desserts.find((d) => d.id === id);
  const existing = cart.find((i) => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
  updateButton(id);
}

// --- Update Cart Display ---
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <img src="images/empty-cart.svg" alt="Empty cart" />
        <p>Your added items will appear here.</p>
      </div>
    `;
    orderTotal.textContent = "$0.00";
    cartCount.textContent = 0;
    cartSummary.style.display = "none"; // hide summary when empty
    return;
  }

  cartSummary.style.display = "block"; // show summary when not empty

  cart.forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-left">
        <span class="item-name">${item.name}</span>
        <span class="item-details">${item.qty}x @$${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}</span>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">×</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  orderTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = count;
}

// --- Update Add Button to Qty Controls ---
function updateButton(id) {
  const btn = document.getElementById(`add-btn-${id}`);
  const item = cart.find((i) => i.id === id);

  if (item) {
    btn.outerHTML = `
      <div class="qty-controls" id="qty-controls-${id}">
        <button onclick="decrement(${id})">−</button>
        <span>${item.qty}</span>
        <button onclick="increment(${id})">+</button>
      </div>
    `;
  }
}

// --- Increment / Decrement ---
function increment(id) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty++;
  updateCart();
  refreshQtyControls(id);
}

function decrement(id) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty--;
    if (item.qty <= 0) {
      removeItem(id);
      return;
    }
  }
  updateCart();
  refreshQtyControls(id);
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCart();
  resetButton(id);
}

// --- Refresh Quantity Display on Buttons ---
function refreshQtyControls(id) {
  const item = cart.find((i) => i.id === id);
  const control = document.getElementById(`qty-controls-${id}`);
  if (item && control) {
    control.querySelector("span").textContent = item.qty;
  }
}

// --- Reset Button when Item Removed ---
function resetButton(id) {
  const card = [...document.querySelectorAll(".card")].find((c) =>
    c.innerHTML.includes(`add-btn-${id}`)
  );
  if (!card) return;
  const img = card.querySelector("img");
  const qtyControls = card.querySelector(`#qty-controls-${id}`);
  if (qtyControls) qtyControls.remove();

  const btn = document.createElement("button");
  btn.classList.add("add-btn");
  btn.id = `add-btn-${id}`;
  btn.textContent = "Add to Cart";
  btn.onclick = () => addToCart(id);
  card.insertBefore(btn, img.nextSibling);
}

// --- Confirm Order Modal ---
confirmOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) return; // no modal if cart empty

  modal.style.display = "flex";
  modalItems.innerHTML = "";

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("modal-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="modal-item-details">
        <h4>${item.name}</h4>
        <p>${item.qty}x @$${item.price.toFixed(2)}</p>
      </div>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    modalItems.appendChild(div);
  });

  modalTotal.textContent = `$${total.toFixed(2)}`;
});


newOrderBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
  modal.style.display = "none";
  desserts.forEach((d) => resetButton(d.id));
});

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// --- Initial Render ---
updateCart();
