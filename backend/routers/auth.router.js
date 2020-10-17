const express = require('express');
const { verifyAuth, verifyUser } = require('../middleware');
const { userController } = require('../controllers/');
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
  userController.createUser,
);

router.post(
  '/signin',
  [authAPIValidator.validateSigninUserAPICall, verifyUser.isAdminByEmail],
  userController.signin,
);

router.post("/verify-signin", userController.verifySignIn);

router.post('/me', [verifyAuth.verifyCookie], userController.verifyMe);

module.exports = router;
