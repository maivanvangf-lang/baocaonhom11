# Backend - Server Side

## 📂 Cấu trúc
```
backend/
├── server.js         # Express REST API server
├── blockchain.js     # Blockchain logic & validation
├── package.json      # Dependencies
└── node_modules/     # Installed packages
```

## 🚀 Chạy Server

```bash
cd backend
npm install
npm start
```

Server sẽ chạy tại: http://localhost:3000

## 🌐 REST API Endpoints

### Nông dân
- `POST /api/batch` - Tạo lô sản phẩm
- `POST /api/farming/:id` - Ghi nhận chăm sóc
- `POST /api/harvest/:id` - Thu hoạch

### Doanh nghiệp
- `POST /api/quality/:id` - Kiểm định chất lượng
- `POST /api/packaging/:id` - Đóng gói sản phẩm

### Vận chuyển
- `POST /api/transport/:id` - Ghi nhận vận chuyển

### Kho bãi
- `POST /api/warehouse/:id` - Nhập/Xuất kho

### Truy xuất
- `GET /api/batch/:id` - Lấy thông tin lô hàng
- `GET /api/qrcode/:id` - Tạo QR code
- `GET /api/statistics` - Thống kê
- `GET /api/validate` - Kiểm tra blockchain

## 🔧 Công nghệ
- Node.js
- Express.js
- SHA-256 (Blockchain)
- QRCode
- CORS, Body-parser
