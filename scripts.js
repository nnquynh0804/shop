// Banner slide show tự động
const bannerSlide = document.getElementById('bannerSlide');
if (bannerSlide) {
  const banners = bannerSlide.querySelectorAll('img');
  let currentIndex = 0;
  function showNextBanner() {
    currentIndex = (currentIndex + 1) % banners.length;
    bannerSlide.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  setInterval(showNextBanner, 5000);
}

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
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex; align-items:center; margin-bottom:10px;">
        <img src="${item.src}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
        <div style="flex:1">
          <strong>${item.name}</strong><br>
          <button onclick="decreaseQty(${index})">-</button>
          <span style="margin: 0 5px;">${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
          - ${itemTotal.toLocaleString('vi-VN')}₫
        </div>
        <button onclick="removeItem(${index})" style="margin-left:10px; background-color: transparent; color: red; border: none; cursor: pointer;">🗑</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });
  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartTotal) cartTotal.textContent = total.toLocaleString('vi-VN') + '₫';
}

function increaseQty(index) {
  cart[index].qty++;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

async function fetchAndRenderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;
  container.innerHTML = 'Đang tải sản phẩm...';
  try {
    const res = await fetch('https://backend-7j0i.onrender.com/products');
    const products = await res.json();
    container.innerHTML = '';
    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${product.images}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.price.toLocaleString()}₫</p>
        <button class="add-to-cart"
          data-id="${product._id}"
          data-name="${product.name}"
          data-price="${product.price}"
          data-src="${product.images}">
          Thêm vào giỏ
        </button>
      `;
      container.appendChild(div);
    });
    attachAddToCartListeners();
  } catch (err) {
    container.innerHTML = 'Không thể tải sản phẩm. Vui lòng thử lại.';
    console.error(err);
  }
}

function attachAddToCartListeners() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const src = btn.dataset.src;
      const productId = btn.dataset.id;
      addToCart(name, price, src, productId);
    });
  });
}

function addToCart(name, price, src, productId) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, src, qty: 1, productId });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Sự kiện mở và đóng giỏ hàng
if (cartBtn && cartModal) {
  cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
  });
}
if (closeCartBtn && cartModal) {
  closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
}

// Sự kiện thanh toán
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
    } else {
      window.location.href = 'thanhtoan.html';
    }
  });
}

// Gửi đơn hàng
const confirmCheckoutBtn = document.getElementById('confirm-checkout-btn');
if (confirmCheckoutBtn) {
  confirmCheckoutBtn.addEventListener('click', async () => {
    const fullName = document.getElementById('fullName')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    if (!fullName || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Bạn cần đăng nhập để thanh toán");
      window.location.href = 'login.html';
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) {
      alert("Giỏ hàng trống");
      return;
    }

    const totalAmount = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
    const shippingFee = 30000;
    const discount = 0;
    const finalAmount = totalAmount + shippingFee - discount;

    const order = {
      orderCode: 'DH' + Date.now(),
      items: cart.map(i => ({
        productId: i.productId || '000000',
        productName: i.name,
        quantity: i.qty,
        price: i.price
      })),
      totalAmount,
      shippingFee,
      discount,
      finalAmount,
      shippingAddress: { fullName, phone, address },
      paymentMethod: 'COD',
      orderStatus: 'PENDING'
    };

    try {
      console.log("📦 ORDER BODY:", order);
      const res = await fetch('https://backend-7j0i.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });

      const result = await res.json();
      if (res.ok) {
        alert('✅ Đặt hàng thành công!');
        localStorage.removeItem('cart');
        window.location.href = 'thankyou.html';
      } else {
        alert('❌ ' + (result.message || 'Lỗi đặt hàng'));
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Lỗi kết nối máy chủ');
    }
  });
}

// Hiển thị nav
function renderNavAuthLinks() {
  const nav = document.getElementById('nav-auth-links');
  const token = localStorage.getItem('token');
  if (!nav) return;
  if (token) {
    const userName = localStorage.getItem('userName') || 'Khách';
    nav.innerHTML = `
      <span>👋 Xin chào, ${userName}</span>
      <a href="#" onclick="logout()">Đăng xuất</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html">Đăng nhập</a>
      <a href="register.html">Đăng ký</a>
    `;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
  window.location.reload();
}

// Khởi động
renderNavAuthLinks();
renderCart();
fetchAndRenderProducts();
