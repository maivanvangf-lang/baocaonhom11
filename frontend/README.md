# Frontend - Client Side

## 📂 Cấu trúc
```
frontend/
├── index.html    # Giao diện chính (tabs đa vai trò)
├── trace.html    # Trang truy xuất nguồn gốc (QR scan)
├── app.js        # Logic frontend, AJAX calls
└── styles.css    # UI/UX responsive design
```

## 🎨 Trang web

### index.html
Giao diện chính với 6 tabs:
1. **Nông dân** - Tạo lô, chăm sóc, thu hoạch
2. **Doanh nghiệp** - Kiểm định, đóng gói
3. **Vận chuyển** - Ghi nhận logistics
4. **Kho bãi** - Quản lý nhập/xuất
5. **Truy xuất** - Tra cứu thông tin lô hàng
6. **Thống kê** - Dashboard tổng quan

### trace.html
- Trang dành cho người tiêu dùng
- Scan QR code hoặc nhập mã lô
- Hiển thị toàn bộ lịch sử sản phẩm

## 🔧 Công nghệ
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Fetch API (AJAX)

## 🌐 Truy cập
Mở trình duyệt: http://localhost:3000
