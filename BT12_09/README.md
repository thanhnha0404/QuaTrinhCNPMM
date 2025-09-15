# cart-library

Thư viện React cho chức năng Giỏ hàng với UI components chuẩn hóa và tích hợp MongoDB backend.

## 🚀 Tính năng

- **UI Components**: Button, Input, Modal, Card chuẩn hóa
- **Cart Component**: Thêm/sửa/xóa sản phẩm trong giỏ hàng
- **Backend API**: Express + MongoDB với CRUD operations
- **Demo App**: Giao diện demo với 2 chế độ (cơ bản + API)

## 📦 Cài đặt

### Thư viện UI
```bash
npm install @thiennhan04/cart-library react react-dom
```

### Backend API (tùy chọn)
```bash
cd backend
npm install
```

## 🎯 Sử dụng nhanh

### Demo cơ bản (chỉ UI)
```tsx
import { Button, Input, Cart } from "@thiennhan04/cart-library";

export default function App() {
  return (
    <div>
      <h1>Demo Cart</h1>
      <Cart />
    </div>
  );
}
```

### Demo với Backend API
```tsx
import { CartWithAPI } from "./CartWithAPI";

export default function App() {
  return <CartWithAPI />;
}
```

## 🛠️ Chạy Demo

### 1. Chạy thư viện UI
```bash
npm run dev
# Mở http://localhost:5173
```

### 2. Chạy Backend API (tùy chọn)
```bash
cd backend

# Tạo dữ liệu mẫu
node seedData.js

# Chạy server
npm run dev
# API: http://localhost:3001/api
```

## 📋 API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới

### Cart
- `GET /api/cart/:sessionId` - Lấy giỏ hàng
- `POST /api/cart/:sessionId/items` - Thêm sản phẩm vào giỏ
- `PATCH /api/cart/:sessionId/items/:itemId` - Cập nhật số lượng
- `DELETE /api/cart/:sessionId/items/:itemId` - Xóa sản phẩm khỏi giỏ
- `DELETE /api/cart/:sessionId` - Xóa toàn bộ giỏ hàng

## 🗄️ Database Schema

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number,
  brand: String,
  sku: String,
  // ... và nhiều field khác
}
```

### Cart
```javascript
{
  sessionId: String, // hoặc userId
  items: [{
    product: ObjectId,
    quantity: Number,
    addedAt: Date
  }],
  totalAmount: Number
}
```

## 🚀 Publish lên npm

```bash
npm login
npm version patch
npm run build
npm publish --access public
```

## 📁 Cấu trúc Project

```
cart-library/
├── src/                    # Thư viện UI
│   ├── components/         # Button, Input, Modal, Card
│   ├── Cart.tsx           # Component giỏ hàng
│   └── index.ts           # Exports
├── backend/               # API Backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   └── server.js         # Express server
├── demo/                 # Demo app
└── dist/                 # Build output
```

## 🔧 Environment Variables

Tạo file `.env` trong thư mục `backend/`:
```
PORT=3001
MONGO_DB_URL=mongodb://localhost:27017/fullstackdb
NODE_ENV=development
```

## 📝 License

MIT

## 👨‍💻 Author

@thiennhan04
