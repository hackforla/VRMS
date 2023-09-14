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
    return res.sendStatus(403);
  }

  try {
    const decoded = jwt.verify(token, CONFIG_AUTH.SECRET);
    res.cookie('token', token, { httpOnly: true });
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

function verifyCookie(req, res, next) {
  jwt.verify(req.cookies.token, CONFIG_AUTH.SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.userId = decoded.id;
    req.role = decoded.accessLevel;

    next();
  });
}

function protect(req, res, next) {
  
  const bearer = req.headers.authorization;

  if(!bearer) {
    res.status(401)
    res.json({message: "You aren't authorized to do this."})
    return
  }

  const [ , token] = bearer.split(' ');

  if (!token) {
    res.status(401)
    res.json({message: "You don't have a valid token."})
    return
  }

  try {
    const user = jwt.verify(token, CONFIG_AUTH.SECRET)
    req.user = user
    next()
  } catch(e) {
    console.log(e)
    res.status(401)
    res.json({message: "You need a valid token, try again."})
    return
  }

}

const AuthUtil = {
  verifyToken,
  verifyCookie,
  protect
};
module.exports = AuthUtil;
