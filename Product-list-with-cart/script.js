const desserts = [
  { id: 1, name: "Waffle with Berries", price: 6.5, img: "./images/waffle.jpg" },
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

let cart = [];

// Display desserts
desserts.forEach(dessert => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${dessert.img}" alt="${dessert.name}">
    <h3>${dessert.name}</h3>
    <p class="price">$${dessert.price.toFixed(2)}</p>
    <button class="add-btn" onclick="addToCart(${dessert.id})">Add to Cart</button>
  `;
  dessertList.appendChild(card);
});

function addToCart(id) {
  const item = desserts.find(d => d.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} (${item.qty}x)</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    cartItemsContainer.appendChild(div);
  });

  orderTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = count;
}

confirmOrderBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  modalItems.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(2)}`;
    modalItems.appendChild(div);
    total += item.price * item.qty;
  });

  modalTotal.textContent = `$${total.toFixed(2)}`;
});

newOrderBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
  modal.style.display = "none";
});

window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};
