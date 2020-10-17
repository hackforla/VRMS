const authMiddleware = require('./auth.middleware');
const verifyUser = require('./user.middleware');

module.exports = {
  authMiddleware,
  verifyUser,
};
