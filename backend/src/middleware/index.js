const AuthUtil = require('./auth.middleware');
const verifyUser = require('./user.middleware');
const verifyToken = require('./token.middleware');

const authHandler = require("./cognitoAuth.middleware");
const errorHandler = require("./errorhandler.middleware");

module.exports = {
  AuthUtil,
  verifyUser,
  verifyToken,
  authHandler,
  errorHandler
};
