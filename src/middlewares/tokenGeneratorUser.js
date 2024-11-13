const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenGeneratorUser = (req, res , next) => {

const payload = {
    email: req.body.email,
    password: req.body.password
};

const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });
 req.token = token
next()
}
module.exports = {tokenGeneratorUser}
