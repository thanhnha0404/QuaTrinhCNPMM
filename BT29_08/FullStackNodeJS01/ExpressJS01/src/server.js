require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const Product = require('./models/product');
const { checkConnection: checkElasticsearch, createProductIndex } = require('./config/elasticsearch');

const app = express(); 

const port = process.env.PORT || 8888;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

configViewEngine(app);

const webApp = express.Router();
app.use('/', webApp);

app.use('/v1/api', apiRoutes);

// Khởi tạo Elasticsearch
const initializeElasticsearch = async () => {
  try {
    const isConnected = await checkElasticsearch();
    if (isConnected) {
      await createProductIndex();
      console.log('Elasticsearch initialized successfully');
    } else {
      console.log('Elasticsearch not available, using MongoDB fallback');
    }
  } catch (error) {
    console.log('Elasticsearch initialization failed:', error.message);
  }
};

(async () => {
    try {
        await connection();
        await initializeElasticsearch();
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();

// API endpoint cũ để tương thích
app.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;   // mặc định trang 1
    const limit = parseInt(req.query.limit) || 10; // mặc định 10 sp / trang
    const skip = (page - 1) * limit;
  
    try {
      const products = await Product.find().skip(skip).limit(limit);
      const total = await Product.countDocuments();
      res.json({
        EC: 0,
        DT: {
          products,
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        }
      });
    } catch (err) {
      res.status(500).json({ EC: -1, EM: "Server error" });
    }
  });