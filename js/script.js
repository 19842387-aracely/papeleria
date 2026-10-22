
const products = [
  {
    id: 1,
    name: "Cuaderno Flores",
    category: "cuadernos",
    description: "Portada floral para todas tus ideas.",
    price: 3.50,
    tag: "Favorito",
    image: "img/agendassss.jpg"
  },
  {
    id: 2,
    name: "Set de resaltadores",
    category: "escritura",
    description: "Tonos suaves para destacar lo importante.",
    price: 3.00,
    tag: "Pastel",
    image: "img/resaltadores.jpeg"
  },
  {
    id: 3,
    name: "Agenda de bolsillo",
    category: "organizacion",
    description: "Un espacio para organizar tus planes.",
    price: 2.35,
    tag: "Nuevo",
    image: "img/agenda de bolsillo.jpg"
  },
  {
    id: 4,
    name: "Stickers delicados",
    category: "detalles",
    description: "Pequeños detalles para tus cuadernos.",
    price: 1.50,
    tag: "Cute",
    image: "img/stikersss.jpeg"
  },
  {
    id: 5,
    name: "Libreta Lavanda",
    category: "cuadernos",
    description: "Para apuntes, ideas y dibujos.",
    price: 3.75,
    tag: "",
    image: "img/libreta la lavanda.jpg"
  },
  {
    id: 6,
    name: "Lapiceros de colores",
    category: "escritura",
    description: "Para títulos y apuntes con color.",
    price: 2.80,
    tag: "",
    image: "img/lapiceross de coloress.jpg"
  },
  {
    id: 7,
    name: "Planificador semanal",
    category: "organizacion",
    description: "Organiza tus pendientes sin complicarte.",
    price: 2.25,
    tag: "",
    image: "img/planificador semanal.jpg"
  },
  {
    id: 8,
    name: "Washi tape pastel",
    category: "detalles",
    description: "Cintas decorativas para apuntes y regalos.",
    price: 2.00,
    tag: "Detalle",
    image: "img/tirrossss.jpg"
  }
];


const grid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const emptyState = document.querySelector("#emptyState");
const cartPanel = document.querySelector("#cartPanel");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");

let cart = [];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const visible = products.filter(product => {
    const matchesCategory = category === "todos" || product.category === category;
    const matchesText = `${product.name} ${product.description}`
      .toLowerCase().includes(query);
    return matchesCategory && matchesText;
  });

  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="add-button" data-add="${product.id}"
          aria-label="Agregar ${product.name} al carrito">+</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <span class="product-price">${money(product.price)}</span>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visible.length > 0;
}

function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartCount.textContent = quantity;
  cartTotal.textContent = money(total);

  cartItems.innerHTML = cart.length
    ? cart.map(item => {
        const product = products.find(product => product.id === item.id);
        return `
          <div class="cart-row">
            <img src="${product.image}" alt="">
            <div>
              <h3>${product.name}</h3>
              <p>${money(product.price)} cada uno</p>
              <p>
                <button data-change="${product.id}" data-amount="-1">−</button>
                ${item.quantity}
                <button data-change="${product.id}" data-amount="1">+</button>
              </p>
            </div>
            <button data-remove="${product.id}" aria-label="Eliminar producto">×</button>
          </div>
        `;
      }).join("")
    : "<p>Tu carrito está vacío. ¡Explora el catálogo!</p>";
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const existing = cart.find(item => item.id === id);

  if (existing) existing.quantity++;
  else cart.push({ id, quantity: 1 });

  renderCart();
});

cartItems.addEventListener("click", event => {
  const changeButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");

  if (changeButton) {
    const id = Number(changeButton.dataset.change);
    const item = cart.find(item => item.id === id);
    item.quantity += Number(changeButton.dataset.amount);
    if (item.quantity <= 0) cart = cart.filter(item => item.id !== id);
  }

  if (removeButton) {
    const id = Number(removeButton.dataset.remove);
    cart = cart.filter(item => item.id !== id);
  }

  renderCart();
});

function openCart() {
  cartPanel.classList.add("open");
  overlay.hidden = false;
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.hidden = true;
}

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.querySelector("#checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Agrega algún producto antes de preparar tu pedido.");
    return;
  }

  const lines = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return `- ${product.name} x${item.quantity}: ${money(product.price * item.quantity)}`;
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const message = `¡Hola! Quisiera consultar este pedido:\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\n¿Me confirman disponibilidad y entrega?`;
// Número de WhatsApp con código de país.
const whatsappNumber = "50373068503";

if (!whatsappNumber) {
  alert("Antes de activar pedidos, agrega tu número de WhatsApp en script.js.");
  return;
}

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
