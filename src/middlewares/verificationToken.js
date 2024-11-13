const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ mensaje: 'No se proporcionó un token' });
    }

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ mensaje: 'Token no válido' });
        }

        req.usuario = decoded;
        //console.log("Token verificado, usuario:", req.usuario);
        next();
    })
}

module.exports = {verificationToken}