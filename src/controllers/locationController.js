const pool = require('../db');

const getRegiones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Regiones');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener regiones:', error);
    res.status(500).json({ error: 'Error al obtener regiones' });
  }
};

const getCiudadesByRegion = async (req, res) => {
  const { regionId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Ciudades WHERE id_region = $1', [regionId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ciudades por región:', error);
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
};

module.exports = { getRegiones, getCiudadesByRegion };
