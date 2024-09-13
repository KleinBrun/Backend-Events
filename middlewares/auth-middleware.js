
require('dotenv').config();
const validateSecretKey = (req, res, next) => {
    const secretKey = req.headers['x-api-key'];
    if (!secretKey || secretKey !== process.env.API_SECRET_KEY) {
        return res.status(401).json({
            error: 'Acceso no autorizado. Se requiere una clave API válida.'
        });
    }
    next();
};

module.exports = { validateSecretKey }