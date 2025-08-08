const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send({ mensaje: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Añade los datos del usuario
        next();
    } catch (ex) {
        res.status(404).send({ mensaje: 'TOKEN NO VALIDO' });
    }
}

module.exports = autenticar;