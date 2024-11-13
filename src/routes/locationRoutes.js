const express = require('express');
const router = express.Router();
const { getRegiones, getCiudadesByRegion } = require('../controllers/locationController');

router.get('/regiones', getRegiones);

router.get('/ciudades/:regionId', getCiudadesByRegion);

module.exports = router;
