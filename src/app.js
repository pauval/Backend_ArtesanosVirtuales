require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
// {
//     origin: ['http://localhost:3000', 'https://artesanos-virtuales.onrender.com'
//     ]
// }
app.use(express.json());
//app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


const catalogoRouter = require('./routes/catalogo');
app.use('/api/catalogo', catalogoRouter);

const userRouter = require('./routes/userRouter');
app.use('/api', userRouter);

const locationRouter = require('./routes/locationRoutes');
app.use('/api', locationRouter);

const productRouter = require('./routes/products');
app.use('/api/products', productRouter);

const categoryRouter = require('./routes/categories');
app.use('/api/categories', categoryRouter);

module.exports = app;