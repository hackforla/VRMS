const express = require('express');
const { verifyUser } = require('../middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

// eslint-disable-next-line func-names
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

router.post(
  '/signup',
  [userController.validateCreateUserAPICall, verifyUser.checkDuplicateEmail],
  userController.createUser,
);

router.post(
  '/signin',
  [userController.validateSigninUserAPICall, verifyUser.isAdmin],
  userController.signin,
);

module.exports = router;
