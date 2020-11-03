const express = require('express');
const { AuthUtil, verifyUser } = require('../middleware');
const { UserController } = require('../controllers/');
const { authAPIValidator } = require('../validators');

const router = express.Router();

// eslint-disable-next-line func-names
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

router.post(
  '/signup',
  [authAPIValidator.validateCreateUserAPICall, verifyUser.checkDuplicateEmail],
  UserController.createUser,
);

router.post(
  '/signin',
  [authAPIValidator.validateSigninUserAPICall, verifyUser.isAdminByEmail],
  UserController.signin,
);

router.post('/verify-signin', UserController.verifySignIn);

router.post('/me', [AuthUtil.verifyCookie], UserController.verifyMe);

module.exports = router;
