const jwt = require("jsonwebtoken");
const CONFIG = require("../config/auth.config.js");

function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
    if (err) {

function verifyCookie(req, res, next) {
  jwt.verify(req.cookies.token, CONFIG.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    req.userId = decoded.id;
    req.role = decoded.accessLevel;

    next();
  });
}

const authJwt = {
  verifyToken,
  verifyCookie,
};
module.exports = authJwt;
