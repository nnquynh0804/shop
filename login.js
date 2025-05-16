document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    window.location.href = '/'; // quay về trang chính
  } else {
    document.getElementById('message').innerText = 'Sai tài khoản hoặc mật khẩu';
  }
});
