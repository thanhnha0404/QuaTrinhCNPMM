# 🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án

## 📋 Tổng Quan
Dự án này triển khai chức năng **tìm kiếm sản phẩm với Fuzzy Search (Elasticsearch)** và **lọc với nhiều điều kiện** bao gồm:
- ✅ Fuzzy Search (tìm kiếm mờ - có thể tìm được kể cả khi gõ sai chính tả)
- ✅ Lọc theo danh mục, giá, đánh giá, khuyến mãi, tồn kho
- ✅ Gợi ý tìm kiếm tự động (Auto-complete)
- ✅ Fallback MongoDB khi Elasticsearch không khả dụng

## 🛠️ Yêu Cầu Hệ Thống
- **Node.js** (phiên bản 16+)
- **MongoDB** (đã cài đặt và chạy)
- **Docker Desktop** (khuyến nghị) hoặc **Elasticsearch** thủ công

## 🚀 Cách 1: Chạy Nhanh (Khuyến nghị)

### Bước 1: Cài đặt Docker Desktop
1. Tải Docker Desktop từ: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop

### Bước 2: Chạy toàn bộ dự án
```bash
# Chạy file batch này để khởi động tất cả
start-full-project.bat
```

Script này sẽ:
- ✅ Khởi động Elasticsearch + Kibana với Docker
- ✅ Tạo index và đồng bộ dữ liệu
- ✅ Khởi động Backend (port 8080)
- ✅ Khởi động Frontend (port 5173)

### Bước 3: Truy cập ứng dụng
- 🌐 **Frontend**: http://localhost:5173
- 🔍 **Backend API**: http://localhost:8080
- 📊 **Kibana Dashboard**: http://localhost:5601

## 🔧 Cách 2: Chạy Thủ Công

### Bước 1: Khởi động Elasticsearch
```bash
# Sử dụng Docker (khuyến nghị)
start-elasticsearch-docker.bat

# Hoặc cài đặt thủ công
install-elasticsearch-manual.bat
```

### Bước 2: Setup dữ liệu Elasticsearch
```bash
setup-elasticsearch-data.bat
```

### Bước 3: Khởi động Backend
```bash
cd ExpressJS01
npm install
npm start
```

### Bước 4: Khởi động Frontend
```bash
cd ReactJS01
npm install
npm run dev
```

## 🧪 Test Các Chức Năng

### 1. Test API Backend
```bash
cd ExpressJS01
npm run test-es
```

### 2. Test tìm kiếm Fuzzy
- Vào trang sản phẩm: http://localhost:5173/products
- Thử tìm kiếm với từ khóa có lỗi chính tả
- Ví dụ: "dien thoai" → sẽ tìm được "điện thoại"

### 3. Test bộ lọc đa điều kiện
- Chọn danh mục
- Đặt khoảng giá
- Chọn đánh giá tối thiểu
- Chọn khuyến mãi tối thiểu
- Chọn "chỉ sản phẩm còn hàng"

## 📊 Các API Endpoints

### Tìm kiếm Fuzzy
```
GET /v1/api/products/fuzzy-search?q=điện thoại&category=electronics&minPrice=1000000
```

### Lọc sản phẩm
```
GET /v1/api/products/filter?category=electronics&minRating=4&inStock=true
```

### Gợi ý tìm kiếm
```
GET /v1/api/products/suggestions?q=điện
```

### Lấy tùy chọn lọc
```
GET /v1/api/products/filter-options
```

## 🐛 Xử Lý Lỗi Thường Gặp

### 1. "Elasticsearch connection failed"
```bash
# Kiểm tra Docker có chạy không
docker ps

# Khởi động lại Elasticsearch
start-elasticsearch-docker.bat
```

### 2. "MongoDB connection failed"
```bash
# Khởi động MongoDB service
net start MongoDB
```

### 3. Frontend không hiển thị sản phẩm
- Kiểm tra Backend có chạy trên port 8080 không
- Kiểm tra file `ReactJS01/src/utils/axios.customize.js` có đúng URL không

### 4. Tìm kiếm không hoạt động
```bash
# Đồng bộ lại dữ liệu
cd ExpressJS01
npm run sync-es
```

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
│   │       └── testElasticsearch.js       # Test API
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
└── *.bat                        # Scripts khởi động
```

## 🎯 Tính Năng Chính

### 1. Fuzzy Search
- Tìm kiếm chính xác
- Tìm kiếm mờ (có lỗi chính tả)
- Tìm kiếm prefix
- Tìm kiếm wildcard

### 2. Multi-condition Filtering
- **Danh mục**: electronics, clothing, books, home, sports, beauty, toys, food
- **Giá**: khoảng giá từ-đến
- **Đánh giá**: tối thiểu 1-5 sao
- **Khuyến mãi**: tối thiểu 10%, 20%, 30%, 50%
- **Tồn kho**: chỉ sản phẩm còn hàng
- **Tags**: các thẻ sản phẩm
- **Ngày tạo**: khoảng thời gian

### 3. Auto-complete Suggestions
- Gợi ý tên sản phẩm khi gõ
- Click để tìm kiếm nhanh

### 4. Fallback Mechanism
- Tự động chuyển sang MongoDB khi Elasticsearch không khả dụng
- Đảm bảo ứng dụng luôn hoạt động

## 🎉 Kết Quả Mong Đợi

Sau khi cài đặt thành công, bạn sẽ có:

1. **Backend API** hoàn chỉnh với Elasticsearch
2. **Frontend React** với giao diện tìm kiếm đẹp
3. **Kibana Dashboard** để xem dữ liệu Elasticsearch
4. **Hệ thống tìm kiếm mạnh mẽ** với fuzzy search
5. **Bộ lọc đa điều kiện** linh hoạt

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs trong terminal
2. Xem Kibana dashboard: http://localhost:5601
3. Test API trực tiếp: http://localhost:8080/v1/api/products/test

---
**Chúc bạn thành công với bài tập! 🎓**

