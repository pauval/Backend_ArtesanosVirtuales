const pool = require('../db');
const bcrypt = require('bcryptjs')
const format = require('pg-format');
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await pool.query(`
          SELECT u.*, c.nombre_ciudad, c.id_region, r.nombre_region
          FROM usuarios u
          LEFT JOIN ciudades c ON u.id_ciudad = c.id_ciudad
          LEFT JOIN regiones r ON c.id_region = r.id_region
          WHERE u.email = $1
      `, [email]);

      if (!result.rows || result.rows.length === 0) {
          return res.status(404).send("Usuario no encontrado");
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.contraseña);
      if (!isMatch) {
          return res.status(401).send("Contraseña incorrecta");
      }

      res.status(200).json({
          message: "Ingreso exitoso. Redirigiendo a perfil de usuario.",
          token: req.token,
          userData: {
              id_usuario: user.id_usuario,
              email: user.email,
              nombre: user.nombre,
              direccion: user.direccion,
              telefono: user.telefono,
              id_ciudad: user.id_ciudad,
              nombre_ciudad: user.nombre_ciudad,
              id_region: user.id_region,
              nombre_region: user.nombre_region,
              id_tipo_de_usuario: user.id_tipo_usuario
          }
      });
  } catch (error) {
      console.error('Error al ingresar:', error);
      res.status(500).send("Error en el servidor");
  }
};


const register = async(req,res) => {
    try {
      const ifRepeat = await pool.query('SELECT * FROM usuarios WHERE email = $1', [req.body.email]);
      if(!req.body.email || !req.body.comuna || !req.body.name || !req.body.direccion || !req.body.telefono || !req.body.password1){
        return res.status(404).send("hubo un error al enviar o recibir los datos");
      }
       if (ifRepeat.rows.length !== 0) {
         return res.status(409).send("el email ya existe");
       }
      const getCiudad = await pool.query('SELECT * FROM ciudades WHERE nombre_ciudad = $1', [req.body.comuna]);
      const ciudad = getCiudad.rows[0].id_ciudad
      const encriptedPassword = bcrypt.hashSync(req.body.password1)
       let pushQuery = format(`INSERT INTO Usuarios (nombre, email, direccion, telefono, contraseña, id_tipo_usuario, id_ciudad) VALUES ('%s', '%s', '%s', %s, '%s', 1 , '%s')`,req.body.name, req.body.email, req.body.direccion, req.body.telefono, encriptedPassword, ciudad )
       const readyForPush = await pool.query(pushQuery)
      res.status(200).send("usuario registrado con exito")
    } catch (error) {
      console.log("error al registrar", error)
    }
}

module.exports = {login, register}