// server.js
require('dotenv').config();
const app = require('./app');
const { initializeDatabase, syncSequences } = require('./scripts/initializeDatabase');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);

  try {
    await initializeDatabase();
    console.log("Datos inicializados correctamente");

    await syncSequences();
    console.log('Base de datos inicializada correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }
});

module.exports = server;