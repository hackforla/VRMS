const { User } = require('../models');

function checkDuplicateEmail(req, res, next) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.sendStatus(400);
    }
    next();
  });
}

function isAdminByEmail(req, res, next) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.sendStatus(400);
    } else {
      const role = user.accessLevel;
      // removed the check for origin === 3001 it was hanging up in Postman
      if (role === 'admin' || user.managedProjects.length > 0) {
        next();
      } else {
        next(res.sendStatus(401));
      }
    }
  });
}

const verifyUser = {
  checkDuplicateEmail,
  isAdminByEmail,
};

module.exports = verifyUser;
