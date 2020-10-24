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
      if (role === 'admin') {
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
