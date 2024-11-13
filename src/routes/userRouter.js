const express = require('express');
const bcrypt = require('bcryptjs');
const routerUser = express.Router();
const pool = require('../db');

const { login, register } = require('../controllers/usersControllers');
const { validatorLogin, validatorRegister } = require('../middlewares/validators');
const {tokenGeneratorUser} = require('../middlewares/tokenGeneratorUser')
const {verificationToken} = require('../middlewares/verificationToken')

routerUser.post('/auth/login', validatorLogin, tokenGeneratorUser,  login);
routerUser.post('/auth/register', validatorRegister, register);


routerUser.get('/compras/:userId', verificationToken, async (req, res) => {
    const { userId } = req.params;
    try {
      const query = `
        SELECT
            p.nombre_producto,
            c.nombre_categoria AS categoria,
            dv.cantidad AS cantidad,
            dv.precio_unitario AS precio,
            dv.cantidad * dv.precio_unitario as total,
            TO_CHAR(v.fecha_venta, 'DD-MM-YYYY') AS fecha,
            TO_CHAR(v.hora_venta, 'HH24:MI:SS') AS hora
        FROM Detalle_Venta dv
        JOIN Productos p ON dv.id_producto = p.id_producto
        JOIN Categoria c ON p.id_categoria = c.id_categoria
        JOIN Ventas v ON dv.id_venta = v.id_venta
        WHERE v.id_cliente = $1
        ORDER BY v.fecha_venta DESC
      `;
      const result = await pool.query(query, [userId]);
      res.json(result.rows || []);
    } catch (error) {
      console.error("Error al obtener historial de compras:", error);
      res.status(500).json({ error: "Error al obtener historial de compras" });
    }
  });

  routerUser.get('/ventas/:userId', verificationToken, async (req, res) => {
    const { userId } = req.params;
    try {
      const query = `
        SELECT
            p.nombre_producto,
            c.nombre_categoria AS categoria,
            dv.cantidad AS cantidad,
            dv.precio_unitario AS precio,
            dv.cantidad * dv.precio_unitario as total,
            TO_CHAR(v.fecha_venta, 'DD-MM-YYYY') AS fecha,
            TO_CHAR(v.hora_venta, 'HH24:MI:SS') AS hora
        FROM Detalle_Venta dv
        JOIN Productos p ON dv.id_producto = p.id_producto
        JOIN Categoria c ON p.id_categoria = c.id_categoria
        JOIN Ventas v ON dv.id_venta = v.id_venta
        WHERE p.id_usuario = $1
        ORDER BY v.fecha_venta DESC
      `;
      const result = await pool.query(query, [userId]);
      //console.log(result.rows);
      res.json(result.rows || []);
    } catch (error) {
      console.error("Error al obtener historial de ventas:", error);
      res.status(500).json({ error: "Error al obtener historial de ventas" });
    }
  });

routerUser.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, direccion, telefono, id_ciudad } = req.body;

    try {
        const query = `
            UPDATE Usuarios
            SET nombre = $1, email = $2, direccion = $3, telefono = $4, id_ciudad = $5
            WHERE id_usuario = $6
            RETURNING *;
        `;
        const result = await pool.query(query, [nombre, email, direccion, telefono, id_ciudad, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al actualizar el perfil del usuario:", error);
        res.status(500).json({ error: "Error al actualizar el perfil del usuario" });
    }
});

routerUser.put('/users/:id/password', async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const result = await pool.query('SELECT contraseña FROM Usuarios WHERE id_usuario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.contraseña);
        if (!isMatch) {
            //console.log("Contraseña actual incorrecta");
            return res.status(400).json({ error: "Contraseña actual incorrecta." });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE Usuarios SET contraseña = $1 WHERE id_usuario = $2', [hashedPassword, id]);

        res.status(200).json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ error: "Error al actualizar la contraseña." });
    }
});

module.exports = routerUser;