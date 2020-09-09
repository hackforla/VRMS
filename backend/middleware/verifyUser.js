const db = require("../models");
const User = db.user;

function checkDuplicateEmail(req, res, next) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!",
      });

      return;
    }
    next();
  });
}

function isAdmin(req, res, next) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(400).send({
        message: "User does not exist",
      });
    } else {
      const role = user.accessLevel;
      if (role === "admin") {
        next();
      } else {
        next(
          res.status(401).send({
            message: "Invalid permissions",
          })
        );
      }
    }
  });
}

const verifyUser = {
  checkDuplicateEmail,
  isAdmin,
};

module.exports = verifyUser;
