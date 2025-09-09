# Hướng dẫn sử dụng Elasticsearch cho tìm kiếm sản phẩm

## Tổng quan

Dự án đã được tích hợp Elasticsearch để cung cấp chức năng tìm kiếm sản phẩm nâng cao với:

- **Fuzzy Search**: Tìm kiếm mờ, cho phép tìm kiếm ngay cả khi có lỗi chính tả
- **Multi-condition Filtering**: Lọc sản phẩm theo nhiều điều kiện khác nhau
- **Auto-complete**: Gợi ý tìm kiếm tự động
- **Real-time Sync**: Đồng bộ dữ liệu từ MongoDB sang Elasticsearch

## Cài đặt Elasticsearch

### 1. Cài đặt Elasticsearch

```bash
# Sử dụng Docker (khuyến nghị)
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0

# Hoặc cài đặt trực tiếp
# Tải từ https://www.elastic.co/downloads/elasticsearch
```

### 2. Kiểm tra kết nối

```bash
curl http://localhost:9200
```

## Cấu hình dự án

### 1. Biến môi trường

Tạo file `.env` trong thư mục `ExpressJS01`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/expressjs01

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

### 2. Cài đặt dependencies

```bash
cd ExpressJS01
npm install
```

## Sử dụng

### 1. Khởi động server

```bash
npm run dev
```

Server sẽ tự động:
- Kết nối MongoDB
- Kết nối Elasticsearch
- Tạo index `products` nếu chưa có

### 2. Đồng bộ dữ liệu

```bash
# Đồng bộ tất cả sản phẩm từ MongoDB sang Elasticsearch
npm run sync-es

# Đồng bộ một sản phẩm cụ thể
npm run sync-single <product_id>

# Xóa sản phẩm khỏi Elasticsearch
npm run delete-es <product_id>
```

### 3. Seed dữ liệu mẫu

```bash
npm run seed
```

## API Endpoints

### Tìm kiếm Fuzzy Search

```http
GET /v1/api/products/fuzzy-search?q=iphone&page=1&limit=10
```

**Query Parameters:**
- `q`: Từ khóa tìm kiếm (bắt buộc)
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số sản phẩm mỗi trang (mặc định: 10)
- `category`: Lọc theo danh mục
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `minRating`: Đánh giá tối thiểu
- `minDiscount`: Khuyến mãi tối thiểu
- `inStock`: Chỉ sản phẩm còn hàng (true/false)
- `tags`: Danh sách tags (phân cách bằng dấu phẩy)

**Ví dụ:**
```http
GET /v1/api/products/fuzzy-search?q=smartphone&category=electronics&minPrice=1000000&maxPrice=5000000&minRating=4&inStock=true
```

### Lọc sản phẩm nâng cao

```http
GET /v1/api/products/filter?search=phone&category=electronics&sortBy=price&sortOrder=asc
```

**Query Parameters:**
- `search`: Từ khóa tìm kiếm
- `category`: Danh mục sản phẩm
- `minPrice`, `maxPrice`: Khoảng giá
- `minRating`: Đánh giá tối thiểu
- `minDiscount`: Khuyến mãi tối thiểu
- `inStock`: Chỉ sản phẩm còn hàng
- `tags`: Danh sách tags
- `dateFrom`, `dateTo`: Khoảng thời gian tạo
- `sortBy`: Sắp xếp theo (price, rating, viewCount, discount, name, createdAt)
- `sortOrder`: Thứ tự sắp xếp (asc, desc)

### Gợi ý tìm kiếm

```http
GET /v1/api/products/suggestions?q=iph&limit=5
```

### Tùy chọn lọc

```http
GET /v1/api/products/filter-options
```

Trả về các tùy chọn lọc có sẵn:
- Danh sách danh mục
- Khoảng giá min/max
- Khoảng đánh giá min/max
- Khoảng khuyến mãi min/max
- Danh sách tags

### Cập nhật lượt xem

```http
PUT /v1/api/products/{id}/view
```

## Cấu trúc dữ liệu Elasticsearch

### Product Document

```json
{
  "id": "product_id",
  "name": "Tên sản phẩm",
  "description": "Mô tả sản phẩm",
  "price": 1000000,
  "category": "electronics",
  "image": "url_to_image",
  "stock": 100,
  "rating": 4.5,
  "viewCount": 150,
  "isActive": true,
  "tags": ["smartphone", "apple"],
  "discount": 10,
  "isFeatured": false,
  "weight": 200,
  "dimensions": {
    "length": 15,
    "width": 8,
    "height": 1
  },
  "brand": "Apple",
  "sku": "IPHONE-15-128GB",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Tính năng Fuzzy Search

### 1. Tìm kiếm chính xác
- Tìm kiếm theo cụm từ chính xác
- Boost cao nhất (3x)

### 2. Tìm kiếm mờ (Fuzzy)
- Cho phép lỗi chính tả
- Sử dụng thuật toán Levenshtein distance
- Boost trung bình (2x)

### 3. Tìm kiếm prefix
- Tìm kiếm theo tiền tố
- Hữu ích cho auto-complete
- Boost thấp (1.5x)

### 4. Tìm kiếm wildcard
- Tìm kiếm với ký tự đại diện
- Boost thấp nhất (1x)

## Frontend Integration

### 1. Component AdvancedSearch

```jsx
import AdvancedSearch from '../components/search/AdvancedSearch';

<AdvancedSearch 
  onSearchResults={handleSearchResults}
  onFilterChange={handleFilterChange}
/>
```

### 2. Sử dụng API

```javascript
import { fuzzySearchApi, filterProductsApi } from '../utils/api';

// Fuzzy search
const results = await fuzzySearchApi('iphone', {
  category: 'electronics',
  minPrice: 1000000
});

// Filter products
const filtered = await filterProductsApi({
  search: 'phone',
  sortBy: 'price',
  sortOrder: 'asc'
});
```

## Troubleshooting

### 1. Elasticsearch không kết nối được

```bash
# Kiểm tra Elasticsearch có chạy không
curl http://localhost:9200

# Kiểm tra logs
docker logs elasticsearch
```

### 2. Dữ liệu không đồng bộ

```bash
# Đồng bộ lại toàn bộ dữ liệu
npm run sync-es
```

### 3. Index không tồn tại

```bash
# Tạo lại index
curl -X DELETE http://localhost:9200/products
npm run sync-es
```

### 4. Lỗi mapping

```bash
# Xóa và tạo lại index
curl -X DELETE http://localhost:9200/products
# Restart server để tạo lại index
```

## Performance Tips

### 1. Tối ưu Elasticsearch

```yaml
# elasticsearch.yml
indices.memory.index_buffer_size: 30%
indices.queries.cache.size: 10%
```

### 2. Tối ưu queries

- Sử dụng `filter` thay vì `query` khi có thể
- Sử dụng `bool` query với `must` và `filter`
- Sử dụng `terms` query cho multiple values

### 3. Monitoring

```bash
# Kiểm tra cluster health
curl http://localhost:9200/_cluster/health

# Kiểm tra index stats
curl http://localhost:9200/products/_stats
```

## Kết luận

Hệ thống tìm kiếm với Elasticsearch đã được tích hợp hoàn chỉnh, cung cấp:

- ✅ Fuzzy search với khả năng tìm kiếm mờ
- ✅ Multi-condition filtering
- ✅ Auto-complete suggestions
- ✅ Real-time data synchronization
- ✅ Responsive frontend interface
- ✅ Comprehensive API documentation

Hệ thống sẵn sàng cho production với khả năng mở rộng cao và performance tốt.
