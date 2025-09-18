const fs = require('fs');
const path = require('path');

const switchSearchEngine = (engine) => {
  try {
    const configPath = path.join(__dirname, 'config.env');
    
    // Đọc file config hiện tại
    let config = '';
    if (fs.existsSync(configPath)) {
      config = fs.readFileSync(configPath, 'utf8');
    }
    
    // Cập nhật cấu hình
    if (engine === 'elasticsearch') {
      config = config.replace(/USE_ELASTICSEARCH=.*/g, 'USE_ELASTICSEARCH=true');
      console.log('✅ Đã chuyển sang Elasticsearch');
      console.log('📋 Các bước tiếp theo:');
      console.log('1. Khởi động Elasticsearch: docker run -d -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.17.0');
      console.log('2. Setup: npm run setup-elasticsearch');
      console.log('3. Test: npm run test-fuzzy');
    } else if (engine === 'mongodb') {
      config = config.replace(/USE_ELASTICSEARCH=.*/g, 'USE_ELASTICSEARCH=false');
      console.log('✅ Đã chuyển sang MongoDB');
      console.log('📋 Các bước tiếp theo:');
      console.log('1. Khởi động MongoDB: mongod --dbpath C:\\data\\db');
      console.log('2. Seed data: npm run seed');
      console.log('3. Test: curl "http://localhost:8080/v1/api/products/search-mongodb?q=galay"');
    } else {
      console.log('❌ Engine không hợp lệ. Sử dụng: elasticsearch hoặc mongodb');
      return;
    }
    
    // Ghi file config
    fs.writeFileSync(configPath, config);
    
    console.log(`\n🎯 Search engine hiện tại: ${engine.toUpperCase()}`);
    console.log('🔄 Khởi động lại server để áp dụng thay đổi');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
};

// Lấy tham số từ command line
const engine = process.argv[2];

if (!engine) {
  console.log('🔧 Công cụ chuyển đổi Search Engine');
  console.log('');
  console.log('Cách sử dụng:');
  console.log('  node switch-search-engine.js elasticsearch');
  console.log('  node switch-search-engine.js mongodb');
  console.log('');
  console.log('Tính năng:');
  console.log('  elasticsearch - Sử dụng Elasticsearch (fuzzy search mạnh)');
  console.log('  mongodb      - Sử dụng MongoDB (đơn giản, không cần Docker)');
} else {
  switchSearchEngine(engine);
}


