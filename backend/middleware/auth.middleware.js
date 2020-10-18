const jwt = require('jsonwebtoken');
const { CONFIG_AUTH } = require('../config');

function verifyToken(req, res, next) {
  // Allow users to set token
  // eslint-disable-next-line dot-notation
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (!token) {
    return res.status(403).send({ message: 'Auth token is not supplied' });
  }

  try {
    jwt.verify(token, CONFIG_AUTH.SECRET);
    res.cookie('token', token, { httpOnly: true });
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).send({ message: err });
  }
}

function verifyCookie(req, res, next) {
  jwt.verify(req.cookies.token, CONFIG_AUTH.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    req.userId = decoded.id;
    req.role = decoded.accessLevel;

    next();
  });
}

const verifyAuth = {
  verifyToken,
  verifyCookie,
};
module.exports = verifyAuth;
