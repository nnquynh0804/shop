document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  try {
    const res = await fetch('https://backend-7j0i.onrender.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();
    if (res.ok) {
      sessionStorage.setItem('token', result.token);
      sessionStorage.setItem('role', result.role);
      sessionStorage.setItem('userName', result.fullName || 'User');
    
      window.location.href = '/index.html'; // 👉 Trang quản lý dành cho admin
    

    } else {
      errorEl.textContent = result.message || 'Sai thông tin đăng nhập';
    }
  } catch (err) {
    errorEl.textContent = 'Không kết nối được máy chủ';
    console.error(err);
  }
});
