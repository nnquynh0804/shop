 // Slide banner
    let index = 0;
    const slides = document.getElementById("bannerSlide");
    const totalSlides = slides.children.length;
    setInterval(() => {
      index = (index + 1) % totalSlides;
      slides.style.transform = translateX(-${index * 100}%);
    }, 4000);
  // Khai báo biến cho các phần tử modal và nút giỏ hàng
  const cartBtn = document.getElementById('view-cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  const cart = [];

  function formatCurrency(value) {
    // Dùng Intl.NumberFormat cho định dạng tiền chuẩn
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  function updateCartDisplay() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const li = document.createElement("li");
      li.innerHTML = 
        <div style="display:flex; align-items:center; margin-bottom:10px;">
          <img src="${item.src}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
          <div>
            <strong>${item.name}</strong> x${item.qty} - ${formatCurrency(itemTotal)}<br>
            <button class="remove-btn" onclick="removeItem(${index})">X</button>
          </div>
        </div>
      ;
      cartItems.appendChild(li);
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = formatCurrency(total);
  }

  function removeItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
  }

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = parseInt(button.getAttribute("data-price"));
      const src = button.getAttribute("data-src");

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, src, qty: 1 });
      }

      updateCartDisplay();
    });
  });

  // Mở/đóng modal giỏ hàng
  cartBtn.addEventListener("click", () => {
    if (cartModal.style.display === "block") {
      cartModal.style.display = "none";
    } else {
      cartModal.style.display = "block";
    }
  });

  closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  checkoutBtn.addEventListener('click', () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'thanhtoan.html';
  });
</script>

  <!--Start of Tawk.to Script-->
  <script type="text/javascript">
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6823517cf3a72c190e2fa4d6/1ir4vcjk3';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  </script>
  <!--End of Tawk.to Script-->
</body>
