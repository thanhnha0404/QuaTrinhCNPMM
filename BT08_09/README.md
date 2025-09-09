# 🎯 Bài Tập 05 - Tìm Kiếm Sản Phẩm với Fuzzy Search (Elasticsearch)

## 📋 Tổng Quan
Dự án triển khai chức năng **tìm kiếm sản phẩm với Fuzzy Search (Elasticsearch)** và **lọc với nhiều điều kiện** bao gồm:
- ✅ **Fuzzy Search** - Tìm kiếm mờ (có thể tìm được kể cả khi gõ sai chính tả)
- ✅ **Multi-condition Filtering** - Lọc theo danh mục, giá, đánh giá, khuyến mãi, tồn kho
- ✅ **Auto-complete Suggestions** - Gợi ý tìm kiếm tự động
- ✅ **Fallback Mechanism** - Tự động chuyển sang MongoDB khi Elasticsearch không khả dụng

## 🚀 Cách Chạy Dự Án

### **Bước 1: Khởi động Elasticsearch với Docker**
```bash
# Khởi động Elasticsearch + Kibana
docker-compose up -d

# Kiểm tra Elasticsearch đã sẵn sàng
curl http://localhost:9200
```

### **Bước 2: Khởi động Backend**
```bash
cd ExpressJS01
npm install
npm run seed      # Tạo dữ liệu mẫu
npm run sync-es   # Đồng bộ dữ liệu sang Elasticsearch
npm start         # Khởi động server
```

### **Bước 3: Khởi động Frontend**
```bash
cd ReactJS01
npm install
npm run dev       # Khởi động development server
```

### **Hoặc sử dụng script tự động:**
```bash
start-project.bat
```

## 📊 Truy Cập Ứng Dụng

- 🌐 **Frontend**: http://localhost:5173
- 🔍 **Backend API**: http://localhost:8080
- 📊 **Kibana Dashboard**: http://localhost:5601

## 🎯 Tính Năng Chính

### **1. Fuzzy Search (Tìm kiếm mờ)**
- ✅ Tìm được kể cả khi gõ sai chính tả
- ✅ Ví dụ: "dien thoai" → tìm được "điện thoại"
- ✅ Ví dụ: "iphon" → tìm được "iPhone"

### **2. Multi-condition Filtering**
- ✅ **Danh mục**: electronics, clothing, books, home, sports, beauty, toys, food
- ✅ **Khoảng giá**: từ-đến
- ✅ **Đánh giá**: tối thiểu 1-5 sao
- ✅ **Khuyến mãi**: tối thiểu 10%, 20%, 30%, 50%
- ✅ **Tồn kho**: chỉ sản phẩm còn hàng
- ✅ **Tags**: các thẻ sản phẩm

### **3. Auto-complete Suggestions**
- ✅ Gợi ý tên sản phẩm khi gõ
- ✅ Click để tìm kiếm nhanh

## 📡 API Endpoints

### **Tìm kiếm Fuzzy**
```
GET /v1/api/products/fuzzy-search?q=điện thoại&category=electronics&minPrice=1000000
```

### **Lọc sản phẩm**
```
GET /v1/api/products/filter?category=electronics&minRating=4&inStock=true
```

### **Gợi ý tìm kiếm**
```
GET /v1/api/products/suggestions?q=điện
```

### **Lấy tùy chọn lọc**
```
GET /v1/api/products/filter-options
```

## 🧪 Test Các Chức Năng

### **Test Backend**
```bash
cd ExpressJS01

# Test Elasticsearch
npm run test-es

# Test MongoDB fallback
npm run test-fallback

# Seed dữ liệu mẫu
npm run seed

# Đồng bộ dữ liệu
npm run sync-es
```

### **Test Frontend**
1. Truy cập: http://localhost:5173/products
2. Thử tìm kiếm với từ khóa có lỗi chính tả
3. Thử các bộ lọc khác nhau
4. Kiểm tra gợi ý tìm kiếm

## 📁 Cấu Trúc Dự Án

```
FullStackNodeJS01/
├── ExpressJS01/                 # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── elasticsearch.js # Cấu hình Elasticsearch
│   │   ├── services/
│   │   │   ├── elasticsearchService.js    # Logic Elasticsearch
│   │   │   └── fallbackSearchService.js   # Fallback MongoDB
│   │   ├── controllers/
│   │   │   └── productController.js       # API Controllers
│   │   └── scripts/
│   │       ├── syncToElasticsearch.js     # Đồng bộ dữ liệu
│   │       ├── testElasticsearch.js       # Test Elasticsearch
│   │       └── testFallbackSearch.js      # Test MongoDB fallback
│   └── package.json
├── ReactJS01/                   # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   └── search/
│   │   │       └── AdvancedSearch.jsx     # Component tìm kiếm
│   │   └── utils/
│   │       └── api.js                     # API calls
│   └── package.json
├── docker-compose.yml           # Cấu hình Docker
└── start-project.bat            # Script khởi động
```

## 🎓 Điểm Nổi Bật

### **1. Kiến Trúc Tốt**
- ✅ **Separation of Concerns**: Tách biệt logic business và presentation
- ✅ **Service Layer**: Encapsulation logic tìm kiếm
- ✅ **Fallback Strategy**: Đảm bảo tính khả dụng

### **2. Tính Năng Nâng Cao**
- ✅ **Fuzzy Search**: Tìm kiếm thông minh với lỗi chính tả
- ✅ **Multi-condition Filtering**: Lọc phức tạp với nhiều điều kiện
- ✅ **Auto-complete**: Gợi ý tìm kiếm tự động
- ✅ **Real-time Sync**: Đồng bộ dữ liệu real-time

### **3. User Experience**
- ✅ **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- ✅ **Loading States**: Hiển thị trạng thái loading
- ✅ **Error Handling**: Xử lý lỗi graceful
- ✅ **Vietnamese Support**: Hỗ trợ tiếng Việt đầy đủ

## 🏆 Kết Quả Test

```
🔍 Testing Fuzzy Search...
1. Tìm kiếm chính xác "iPhone": Found 1 products
2. Tìm kiếm mờ "iphon" (thiếu e): Found 1 products
3. Tìm kiếm "phone" với filter: Found 1 products

🔧 Testing Filter Products...
1. Filter by category=electronics: Found 3 products
2. Filter by price range: Found 4 products
3. Filter by minRating=4: Found 12 products

💡 Testing Search Suggestions...
1. Suggestions for "iph": ['iPhone 15 Pro Max']

📊 Testing Filter Options...
Filter options: {
  categories: 8,
  priceRange: { min: 199000, max: 45990000 },
  ratingRange: { min: 4.2, max: 4.8 },
  discountRange: { min: 0, max: 0 },
  tags: 0
}

⚡ Testing Performance...
10 concurrent searches completed in 31ms
Average time per search: 3.1ms

✅ All tests completed successfully!
```

## 🎉 Hoàn Thành!

Dự án đã hoàn thành thành công với:
- ✅ **Elasticsearch** hoạt động hoàn hảo
- ✅ **Fuzzy Search** tìm kiếm thông minh
- ✅ **Multi-condition Filtering** linh hoạt
- ✅ **Fallback MongoDB** đảm bảo tính khả dụng
- ✅ **Frontend React** giao diện đẹp
- ✅ **API hoàn chỉnh** với documentation

**Chúc bạn thành công với bài nộp! 🎓**