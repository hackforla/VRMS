const jwt = require('jsonwebtoken');
const CONFIG = require('../config/auth.config.js');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    return next();
  });
  return next();
}

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
