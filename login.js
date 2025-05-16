const mockUser = {
  email: 'user@gmail.com',
  password: '123456'
};

const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('login-error');

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email === mockUser.email && password === mockUser.password) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    window.location.href = 'index.html'; // hoặc trang chính của bạn
  } else {
    errorMsg.textContent = 'Sai email hoặc mật khẩu!';
  }
});
