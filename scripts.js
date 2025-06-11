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

// ✅ Xóa các item không có productId (tránh lỗi khi submit)
cart = cart.filter(item => item.productId);
sessionStorage.setItem('cart', JSON.stringify(cart));

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
  sessionStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function removeItem(index) {
  cart.splice(index, 1);
  sessionStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  }
  sessionStorage.setItem('cart', JSON.stringify(cart));
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
      <div class="product-content" data-id="${product._id}" style="cursor:pointer;">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.price.toLocaleString()}₫</p>
      </div>
      <button class="add-to-cart"
        data-id="${product._id}"
        data-name="${product.name}"
        data-price="${product.price}"
        data-src="${product.imageUrl}">
        Thêm vào giỏ
      </button>
    `;
      const productContent = div.querySelector('.product-content');
      productContent.addEventListener('click', () => {
        window.location.href = `about.html?id=${product._id}`;
      });



      const role = localStorage.getItem('role');
      if (role === 'admin') {
        const adminActions = document.createElement('div');
        adminActions.className = 'admin-actions';
        adminActions.innerHTML = `
          <button class="edit-btn" onclick="editProduct('${product._id}')">✏️ Sửa</button>
          <button class="delete-btn" onclick="deleteProduct('${product._id}')">🗑️ Xóa</button>
        `;
        div.appendChild(adminActions);
      }

      container.appendChild(div);
    });

    // ✅ GỌI HÀM GẮN SỰ KIỆN SAU KHI ĐÃ RENDER
    attachAddToCartListeners();

  } catch (err) {
    container.innerHTML = 'Lỗi khi tải sản phẩm!';
    console.error(err);
  }
}


// Hàm chuyển hướng đến trang chỉnh sửa
function editProduct(productId) {
  window.location.href = `./content/product-edit.html?id=${productId}`;
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
  const existing = cart.find(item => item.name === name && item.productId === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, src, qty: 1, productId });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Sự kiện mở/đóng giỏ hàng
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
    sessionStorage.setItem('cart', JSON.stringify(cart));
    const token = sessionStorage.getItem('token');
    window.location.href = 'thanhtoan.html';
  });
}

// Gửi đơn hàng từ trang thanh toán
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
        productId: i.productId,
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

    console.log("📦 Gửi đơn hàng:", order);

    try {
      const res = await fetch('https://backend-7j0i.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });

      const result = await res.json();
      console.log("🔢 STATUS:", res.status, "🧾 RESPONSE:", result);

      if (res.status === 200 || res.status === 201) {
        alert('✅ Đặt hàng thành công!');
        localStorage.removeItem('cart');
        window.location.href = 'thankyou.html';
      } else {
        alert('❌ ' + (result.message || 'Lỗi đặt hàng'));
      }
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      alert('⚠️ Lỗi kết nối máy chủ');
    }
  });
}

// Hiển thị nav
function renderNavAuthLinks() {
  const nav = document.getElementById('nav-auth-links');
  const token = sessionStorage.getItem('token');
  if (!nav) return;
  if (token) {
    const userName = sessionStorage.getItem('userName') || 'Khách';
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
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('userName');
  window.location.reload();
}

// Khởi động
renderNavAuthLinks();
renderCart();
fetchAndRenderProducts();
