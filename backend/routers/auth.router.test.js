import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';

// Set up mocks for User model and controller
vi.mock('../controllers/user.controller');
vi.mock('../controllers/email.controller');
vi.mock('../models/user.model');
// Set up mocks for middleware
vi.mock('../middleware/index.js', () => ({
  Auth: {
    authUser: vi.fn((req, res, next) => next()),
  },
  AuthUtil: {
    verifyCookie: vi.fn((req, res, next) => next()),
  },
  verifyUser: {
    checkDuplicateEmail: vi.fn((req, res, next) => next()),
    isAdminByEmail: vi.fn((req, res, next) => next()),
  },
  verifyToken: {
    isTokenValid: vi.fn((req, res, next) => next()),
  },
}));
vi.mock('../middleware/auth.middleware.js', () => ({
  default: {},
  authenticateRefreshToken: vi.fn((req, res, next) => next()),
}));
// Set up mocks for authApiValidator
vi.mock('../validators/index.js', () => ({
  authApiValidator: {
    validateCreateUserAPICall: vi.fn((req, res, next) => next()),
    validateSigninUserAPICall: vi.fn((req, res, next) => next()),
  },
}));

// Import User model and controller
import { User } from '../models/user.model.js';
const { UserController, EmailController } = await import('../controllers/index.js');

// Import auth router
import express from 'express';
import supertest from 'supertest';
import authRouter from '../routers/auth.router.js';
const { verifyToken, verifyUser, AuthUtil, Auth } = await import('../middleware/index.js');
const { authApiValidator } = await import('../validators/index.js');

// Create a new Express application for testing
const testapp = express();
testapp.use(express.json());
testapp.use('/api/auth', authRouter);
const request = supertest(testapp);


describe('Unit tests for auth router', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    name: {
      firstName: 'mock',
      lastName: 'user',
    },
    email: 'mockUser@test.com',
    accessLevel: 'user',
  };

  describe('CREATE', () => {
    it('should sign up new user with POST /api/auth/signup', async () => {
      UserController.createUser.mockImplementationOnce((req, res) => {
        res.status(201).send({ message: 'User created successfully' });
      });

      const response = await request.post('/api/auth/signup').send({
        name: {
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
        email: mockUser.email.toLowerCase(),
      });

      expect(authApiValidator.validateCreateUserAPICall).toHaveBeenCalled();
      expect(verifyUser.checkDuplicateEmail).toHaveBeenCalled();
      expect(UserController.createUser).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User created successfully' });
    });

    it('should sign in existing user with POST /api/auth/signin', async () => {
      const jsonToken = 'mockedToken';
      const email = mockUser.email.toLowerCase();
      const auth_origin = 'web';
      const cookie = 'mockedCookie';
      const headers = {
        origin: 'http://localhost:3000',
      };

      UserController.signin.mockImplementation((req, res) => {
        res.cookie('token', cookie, { httpOnly: true });
        res.set('origin', headers.origin);

        EmailController.sendLoginLink(
          req.body.email,
          req.body.auth_origin,
          mockUser.name.firstName,
          jsonToken,
          cookie,
          headers.origin,
        );

        res.status(200).send('Signin successful');
      });

      EmailController.sendLoginLink.mockImplementation(() => {
        console.log('Mocked EmailController.sendLoginLink called');
      });

      const response = await request.post('/api/auth/signin').send({
        email: email,
        auth_origin: auth_origin,
      });

      expect(authApiValidator.validateSigninUserAPICall).toHaveBeenCalled();
      expect(UserController.signin).toHaveBeenCalled();
      expect(EmailController.sendLoginLink).toHaveBeenCalledWith(
        email,
        auth_origin,
        mockUser.name.firstName,
        jsonToken,
        cookie,
        headers.origin,
      );
      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain(`token=${cookie}`);
      expect(response.text).toBe('Signin successful');
    });

    it('should verify sign in with POST /api/auth/verify-signin', async () => {
      UserController.verifySignIn.mockImplementation((req, res) => {
        res.status(200).send(mockUser);
      });

      const response = await request.post('/api/auth/verify-signin').send({
        token: 'mockedToken',
      });

      expect(Auth.authUser).toHaveBeenCalled();
      expect(UserController.verifySignIn).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should verify me with POST /api/auth/me', async () => {
      UserController.verifyMe.mockImplementation((req, res) => {
        res.status(200).send(mockUser);
      });

      const response = await request.post('/api/auth/me').send({
        token: 'mockedToken',
      });

      expect(Auth.authUser).toHaveBeenCalled();
      expect(UserController.verifyMe).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should log out with POST /api/auth/logout', async () => {
      const token = 'token';
      UserController.logout.mockImplementation((req, res) => {
        res.clearCookie(token);
        res.status(200).send('Successfully logged out.');
      });

      const response = await request.post('/api/auth/logout').set('Cookie', token);

      expect(UserController.logout).toHaveBeenCalled();
      expect(response.headers['set-cookie'][0]).toMatch(/token=;/);
      expect(response.status).toBe(200);
      expect(response.text).toBe('Successfully logged out.');
    });
  });

});
