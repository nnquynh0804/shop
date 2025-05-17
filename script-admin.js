// Load sidebar từ file riêng
fetch('sidebar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('sidebar-container').innerHTML = html;
  });

// Hàm để load nội dung chính
function loadPage(url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;

      // 👉 Tải lại các <script> bên trong trang nếu có
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.querySelectorAll('script').forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
      });
    })
    .catch(err => {
      document.getElementById('main-content').innerHTML = '<p>Lỗi khi tải nội dung!</p>';
      console.error(err);
    });
}

