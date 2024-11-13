const validatorLogin = (req, res, next) => {
    const validarEmail = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("Debes ingresar email y contraseña");
    }
    if (!validarEmail.test(req.body.email)) {
        return res.status(400).send("Correo electrónico no válido");
    }
    return next();
};

const validatorRegister = (req, res, next) => {
    if (req.body.password1 !== req.body.password2) {
        return res.status(400).send("Las contraseñas no coinciden");
    }
    if (!req.body.email || !req.body.password1 || !req.body.password2 || !req.body.direccion || !req.body.name || !req.body.region || !req.body.telefono || !req.body.comuna) {
        return res.status(404).send("Faltan campos obligatorios");
    }
    return next();
};

// Validador para agregar un producto
const validatorAddProduct = (req, res, next) => {
    const { nombre_producto, descripcion, precio, id_categoria } = req.body;
    const imagenes = req.files || req.body.imagenes;  // Ajustar según cómo se envíen las imágenes

    if (!nombre_producto || !descripcion || !precio || !id_categoria) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    if (isNaN(precio) || precio <= 0) {
        return res.status(400).send("El precio debe ser un número positivo");
    }

    // Validar que al menos una imagen esté presente
    if (!imagenes || (Array.isArray(imagenes) && imagenes.length === 0)) {
        return res.status(400).send("Debe ingresar al menos una imagen del producto");
    }

    return next();
};


// Validador para editar un producto
const validatorEditProduct = (req, res, next) => {
    const { nombre_producto, descripcion, precio, id_categoria } = req.body;

    if (!nombre_producto || !descripcion || !precio || !id_categoria) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    if (isNaN(precio) || precio <= 0) {
        return res.status(400).send("El precio debe ser un número positivo");
    }

    return next();
};

// Validador para cambiar contraseña
const validatorChangePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).send("Ambas contraseñas son obligatorias");
    }

    if (newPassword.length < 8) {
        return res.status(400).send("La nueva contraseña debe tener al menos 8 caracteres");
    }

    return next();
};

module.exports = {
    validatorLogin,
    validatorRegister,
    validatorAddProduct,
    validatorEditProduct,
    validatorChangePassword
};
