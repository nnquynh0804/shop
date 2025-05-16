// Banner slide show tự động
const bannerSlide = document.getElementById('bannerSlide');
const banners = bannerSlide.querySelectorAll('img');
let currentIndex = 0;

function showNextBanner() {
  currentIndex = (currentIndex + 1) % banners.length;
  bannerSlide.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(showNextBanner, 5000);

// Giỏ hàng
const cartBtn = document.getElementById('view-cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsEl = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
  cartItemsEl.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex; align-items:center; margin-bottom:10px;">
        <img src="${item.src}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
        <div>
          <strong>${item.name}</strong><br>
          <button onclick="decreaseQty(${index})">-</button>
          <span style="margin: 0 5px;">${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
          - ${itemTotal.toLocaleString('vi-VN')}₫
          <br>
          <button class="remove-btn" onclick="removeItem(${index})">X</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartTotal.textContent = total.toLocaleString('vi-VN') + '₫';
}
function increaseQty(index) {
  cart[index].qty++;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    // Nếu muốn xoá luôn khi về 0 thì bỏ comment dòng sau
    // cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}



function addToCart(name, price, src) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, src, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const src = btn.dataset.src;
    addToCart(name, price, src);
  });
});
cartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex';
});

closeCartBtn.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'thanhtoan.html';
  });

// Khởi tạo giỏ hàng khi load trang
renderCart();
