require('dotenv').config();

const express = require('express'); 
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const productRoutes = require('./routes/product');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const { checkConnection, createProductIndex } = require('./config/elasticsearch');

const app = express(); 

const port = process.env.PORT || 8888;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

configViewEngine(app);

const webApp = express.Router();
webApp.get('/', getHomepage);
app.use('/', webApp);

app.use('/v1/api/products', productRoutes);
app.use('/v1/api', apiRoutes);

(async () => {
    try {
        await connection();
        
        // Kiểm tra kết nối Elasticsearch
        const elasticsearchConnected = await checkConnection();
        if (elasticsearchConnected) {
            await createProductIndex();
        }
        
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();

