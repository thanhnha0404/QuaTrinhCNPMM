require('dotenv').config();

const express = require('express');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');

const app = express(); 

const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

configViewEngine(app);

const webApp = express.Router();
webApp.get('/', getHomepage);
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


