const express = require('express');
const { AuthUtil, verifyUser, verifyToken } = require('../middleware');
const { UserController } = require('../controllers/');
const { authApiValidator } = require('../validators');
const { authenticateRefreshToken } = require('../middleware/auth.middleware');

const router = express.Router();

 
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

router.post('/refresh-access-token', [authenticateRefreshToken], UserController.refreshAccessToken);

router.post('/signin', [authApiValidator.validateSigninUserAPICall], UserController.signin);

router.post('/verify-signin', [verifyToken.isTokenValid], UserController.verifySignIn);

router.post('/me', [AuthUtil.verifyCookie], UserController.verifyMe);

router.post('/logout', [authenticateRefreshToken], UserController.logout);

module.exports = router;
