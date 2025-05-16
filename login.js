document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  const res = await fetch('https://backend-7j0i.onrender.com/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await res.json();
  if (res.ok) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('role', result.role);
    window.location.href = '/index.html';
  } else {
    errorEl.textContent = result.message || 'Sai thông tin đăng nhập';
  }
});
