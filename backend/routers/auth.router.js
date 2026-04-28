import express from 'express';
import { Auth, verifyUser } from '../middleware/index.js';
import { UserController } from '../controllers/index.js';
import { authApiValidator } from '../validators/index.js';
import { authenticateRefreshToken } from '../middleware/auth.middleware.js';

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

router.post('/verify-signin', [Auth.authUser], UserController.verifySignIn);

router.post('/me', [Auth.authUser], UserController.verifyMe);

router.post('/logout', [authenticateRefreshToken], UserController.logout);

module.exports = router;
