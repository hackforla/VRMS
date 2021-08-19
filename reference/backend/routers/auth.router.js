const express = require('express');
const { AuthUtil, verifyUser, verifyToken } = require('../middleware');
const { UserController } = require('../controllers/');
const { authApiValidator } = require('../validators');

const router = express.Router();

// eslint-disable-next-line func-names
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

// The root is /api/auth
router.post(
  '/signup',
  [authApiValidator.validateCreateUserAPICall, verifyUser.checkDuplicateEmail],
  UserController.createUser,
);

router.post(
  '/signin',
  [authApiValidator.validateSigninUserAPICall, verifyUser.isAdminByEmail],
  UserController.signin,
);

router.post('/verify-signin', [verifyToken.isTokenValid], UserController.verifySignIn);

router.post('/me', [AuthUtil.verifyCookie], UserController.verifyMe);

module.exports = router;
