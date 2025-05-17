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
    })
    .catch(err => {
      document.getElementById('main-content').innerHTML = '<p>Lỗi khi tải nội dung!</p>';
      console.error(err);
    });
}
