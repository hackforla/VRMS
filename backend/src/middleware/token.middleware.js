const jwt = require('jsonwebtoken');
const { CONFIG_AUTH } = require('../config');

async function isTokenValid(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.sendStatus(400);
  }

  try {
    jwt.verify(token, CONFIG_AUTH.SECRET);
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

const verifyToken = {
  isTokenValid,
};

module.exports = verifyToken;
