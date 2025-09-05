require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const Product = require('./models/product');
//const { getHomepage } = require('./controllers/homeController');
const app = express(); 

const port = process.env.PORT || 8888;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

configViewEngine(app);

const webApp = express.Router();
//webApp.get('/', getHomepage);
app.use('/', webApp);

app.use('/v1/api', apiRoutes);

(async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();

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
