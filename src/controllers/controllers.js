const pool = require('../db');

const getCatalogo = async (req, res) => {
    try {
        const query = `
            SELECT
                p.id_producto AS id,
                p.nombre_producto AS titulo,
                p.descripcion,
                MAX(CASE WHEN i.es_principal = TRUE THEN i.url_imagen END) AS imagen_principal,
                CASE
                    WHEN COUNT(CASE WHEN i.es_principal = FALSE THEN i.url_imagen END) > 0
                    THEN ARRAY_REMOVE(
                        ARRAY_AGG(CASE WHEN i.es_principal = FALSE OR i.es_principal = TRUE THEN i.url_imagen END),
                        NULL
                    )
                END AS imagenes_secundarias,
                p.precio AS valor,
                c.nombre_categoria AS categoria,
                p.id_usuario AS id_vendedor,
                s.cantidad AS stock
            FROM
                Productos p
            JOIN
                Categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN
                Imagenes i ON p.id_producto = i.id_producto
            JOIN
                Stock s ON p.id_producto = s.id_producto
            WHERE s.cantidad > 0
            GROUP BY
                p.id_producto, p.nombre_producto, p.descripcion, p.precio, c.nombre_categoria, p.id_usuario, s.cantidad;
        `;

        const result = await pool.query(query);
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error al obtener productos del catálogo:', error);
        res.status(500).json({ error: 'Error al obtener productos del catálogo' });
    }
};

const registrarVenta = async (req, res) => {
    const { id_cliente, carrito, total } = req.body;

    try {
        const ventaResult = await pool.query(
            `INSERT INTO Ventas (id_cliente, fecha_venta, hora_venta, total) VALUES ($1, CURRENT_DATE, CURRENT_TIME, $2) RETURNING id_venta`,
            [id_cliente, total]
        );

        const id_venta = ventaResult.rows[0].id_venta;

        for (const item of carrito) {
            const stockResult = await pool.query(
                `SELECT cantidad FROM Stock WHERE id_producto = $1`,
                [item.id]
            );

            const stockActual = stockResult.rows[0].cantidad;

            if (stockActual < item.cantidad) {
                return res.status(400).json({
                    error: `No hay suficiente stock para el producto ${item.id}. Stock disponible: ${stockActual}`,
                });
            }

            await pool.query(
                `INSERT INTO Detalle_Venta (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)`,
                [id_venta, item.id, item.cantidad, item.valor]
            );

            await pool.query(
                `UPDATE Stock SET cantidad = cantidad - $1 WHERE id_producto = $2`,
                [item.cantidad, item.id]
            );
        }

        res.status(200).json({ message: "Compra realizada con éxito", id_venta });
    } catch (error) {
        console.error("Error al registrar la venta:", error);
        res.status(500).json({ error: "Error al registrar la venta" });
    }
};

module.exports = { getCatalogo, registrarVenta };
