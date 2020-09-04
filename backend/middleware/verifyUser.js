const db = require("../models");
const User = db.user;

checkDuplicateEmail = function (req, res, next) {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!",
      });

      return;
    }
    next();
  });
};

const verifyUser = {
  checkDuplicateEmail,
};

module.exports = verifyUser;
