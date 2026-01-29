# Database - Storage Layer

## 📂 Cấu trúc
```
database/
└── chain.json    # Blockchain data storage
```

## 💾 Lưu trữ dữ liệu

### chain.json
File JSON chứa toàn bộ blockchain với cấu trúc:

```json
[
  {
    "index": 0,
    "timestamp": "2025-11-26T09:00:00.000Z",
    "data": { "info": "Genesis Block" },
    "previousHash": "0",
    "hash": "genesis_hash..."
  },
  {
    "index": 1,
    "timestamp": "2025-11-26T10:00:00.000Z",
    "data": {
      "type": "batch",
      "batchId": "LOT-2025-001",
      "product": "Cà chua",
      "producer": "Nông dân A",
      ...
    },
    "previousHash": "genesis_hash...",
    "hash": "block1_hash..."
  }
]
```

## 📊 Đặc điểm

- **Persistent Storage**: Dữ liệu được lưu vĩnh viễn
- **File-based**: Sử dụng hệ thống file JSON
- **Blockchain**: Mỗi block liên kết với block trước qua hash
- **Immutable**: Dữ liệu không thể sửa đổi sau khi ghi

## 🔒 Bảo mật

- SHA-256 hashing cho mỗi block
- Liên kết previousHash đảm bảo toàn vẹn
- Validation tự động khi load dữ liệu

## 🔧 Công nghệ
- JSON format
- Node.js fs module
- File system storage
