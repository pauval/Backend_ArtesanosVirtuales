const express = require('express');
const router = express.Router();

const { getCatalogo, registrarVenta } = require('../controllers/controllers');

router.get('/', getCatalogo);

router.post('/registrarVenta', registrarVenta);

module.exports = router;
