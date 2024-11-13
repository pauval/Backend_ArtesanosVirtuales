const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const { verificationToken } = require('../middlewares/verificationToken');
const { validatorAddProduct, validatorChangePassword } = require('../middlewares/validators');
const IMGBB_API_KEY = '99ecd3ffd50e42d41bbcc4ca6481898e';

// Configuración de multer para almacenar las imágenes en memoria temporal
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para obtener los productos de un usuario específico
router.get('/user/:userId',verificationToken, async (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT p.id_producto, p.nombre_producto, p.descripcion,
           p.id_categoria,
           c.nombre_categoria,
           COUNT(i.id_imagen) AS cantidad_imagenes,
           s.cantidad
    FROM Productos p
    LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN Imagenes i ON p.id_producto = i.id_producto
    LEFT JOIN Stock s ON p.id_producto = s.id_producto
    WHERE p.id_usuario = $1
    GROUP BY p.id_producto, c.nombre_categoria, s.cantidad;
  `;
  try {
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Ruta para agregar un producto nuevo, con validación y subida de imágenes a Imgbb
router.post('/', upload.array('images'), validatorAddProduct, async (req, res) => {
  const { nombre_producto, descripcion, precio, id_categoria, id_usuario, cantidad } = req.body;
  const images = req.files;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "Debes agregar al menos una imagen del producto." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO Productos (nombre_producto, descripcion, precio, id_categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_producto",
      [nombre_producto, descripcion, precio, id_categoria, id_usuario]
    );
    const id_producto = result.rows[0].id_producto;

    // Insertar cantidad en la tabla Stock
    await pool.query(
      "INSERT INTO Stock (cantidad, id_producto) VALUES ($1, $2)",
      [cantidad, id_producto]
    );

    for (let i = 0; i < images.length; i++) {
      const imageBase64 = images[i].buffer.toString('base64'); 
      const formData = new URLSearchParams();
      formData.append('image', imageBase64); 
      formData.append('key', IMGBB_API_KEY);
      const response = await axios.post('https://api.imgbb.com/1/upload', formData);
      const imageUrl = response.data.data.url;
      const esPrincipal = i === 0;

      await pool.query(
        "INSERT INTO Imagenes (url_imagen, es_principal, id_producto) VALUES ($1, $2, $3)",
        [imageUrl, esPrincipal, id_producto]
      );
    }

    res.status(201).json({ id_producto, message: "Producto y sus imágenes agregados correctamente" });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto. Por favor, inténtalo de nuevo." });
  }
});

// Ruta para actualizar un producto existente y sus imágenes
router.put('/:id', upload.array('newImages'), async (req, res) => {
  const { id } = req.params;
  const { descripcion, id_categoria, cantidad, deleteImageIds, mainImageId } = req.body;
  const newImages = req.files;

  try {
    // Actualizar la información del producto y el stock
    await pool.query(
      "UPDATE Productos SET descripcion = $1, id_categoria = $2 WHERE id_producto = $3",
      [descripcion, id_categoria, id]
    );
    await pool.query(
      "UPDATE Stock SET cantidad = $1 WHERE id_producto = $2",
      [cantidad, id]
    );

    if (deleteImageIds && deleteImageIds.length > 0) {
      const deleteIdsArray = JSON.parse(deleteImageIds); 
      await pool.query(
        `DELETE FROM Imagenes WHERE id_imagen = ANY($1::int[])`,
        [deleteIdsArray]
      );
    }

    if (mainImageId) {
      await pool.query(
        `UPDATE Imagenes SET es_principal = CASE WHEN id_imagen = $1 THEN TRUE ELSE FALSE END WHERE id_producto = $2`,
        [mainImageId, id]
      );
    }

    if (newImages && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        const imageUrl = `img/${newImages[i].filename}`;
        const esPrincipal = false; 
        await pool.query(
          "INSERT INTO Imagenes (url_imagen, es_principal, id_producto) VALUES ($1, $2, $3)",
          [imageUrl, esPrincipal, id]
        );
      }
    }

    res.status(200).json({ message: "Producto y sus imágenes actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
}); 
 

// Ruta para cambiar la contraseña
router.put('/users/:id/password', validatorChangePassword, async (req, res) => {
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
      console.log("Contraseña actual incorrecta");
      return res.status(400).json({ error: "Contraseña actual incorrecta." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE Usuarios SET contraseña = $1 WHERE id_usuario = $2', [hashedPassword, id]);
    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error al actualizar la contraseña." });
  }
});

module.exports = router;
