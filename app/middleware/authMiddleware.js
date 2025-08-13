const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

module.exports = function verificarToken(req, res, next) {
  let token = req.headers['authorization'] || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
    token = token.slice(7).trim();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    req.userId = decoded.sub;
    req.user = decoded;
    next();
  });
};
