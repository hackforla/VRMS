const Auth = require('./auth.middleware');
const verifyUser = require('./user.middleware');

module.exports = {
  Auth,
  verifyUser,
};
