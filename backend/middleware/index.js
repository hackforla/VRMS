const verifyAuth = require('./auth.middleware');
const verifyUser = require('./user.middleware');

module.exports = {
  verifyAuth,
  verifyUser,
};
