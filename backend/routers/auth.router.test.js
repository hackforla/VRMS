// Set up mocks for User model and controller
jest.mock('../controllers/user.controller');
jest.mock('../controllers/email.controller');
jest.mock('../models/user.model');
// Set up mocks for middleware
jest.mock('../middleware', () => ({
  AuthUtil: {
    verifyCookie: jest.fn((req, res, next) => next()),
  },
  verifyUser: {
    checkDuplicateEmail: jest.fn((req, res, next) => next()),
    isAdminByEmail: jest.fn((req, res, next) => next()),
  },
  verifyToken: {
    isTokenValid: jest.fn((req, res, next) => next()),
  },
}));
// Set up mocks for authApiValidator
jest.mock('../validators/user.api.validator', () => ({
  validateCreateUserAPICall: jest.fn((req, res, next) => next()),
  validateSigninUserAPICall: jest.fn((req, res, next) => next()),
}));

// Import User model and controller
const { User } = require('../models/user.model');
const { UserController, EmailController } = require('../controllers');

// Import auth router
const express = require('express');
const supertest = require('supertest');
const authRouter = require('../routers/auth.router');

// Create a new Express application for testing
const testapp = express();
// Use body parser to extract params in API calls
testapp.use(express.json());
testapp.use('/api/auth', authRouter);
const request = supertest(testapp);

describe('Unit tests for auth router', () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mocker user for test
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
    it('should sign up new user with POST /api/auth/signup', async (done) => {
      // Mock implementation of UserController.createUser
      UserController.createUser.mockImplementationOnce((req, res) => {
        res.status(201).send({ message: 'User created successfully' });
      });

      // Mock POST API call
      const response = await request.post('/api/auth/signup').send({
        name: {
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
        email: mockUser.email.toLowerCase(),
      });

      // Tests
      expect(UserController.createUser).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User created successfully' });

      // Marks completion of tests
      done();
    });

    it('should sign in existing user with POST /api/auth/signin', async (done) => {
      // Mock implementation for UserController.signin
      const jsonToken = 'mockedToken';
      const email = mockUser.email.toLowerCase();
      const auth_origin = 'web';
      const cookie = 'mockedCookie';
      const headers = {
        origin: 'http://localhost:3000',
      };

      UserController.signin.mockImplementation((req, res) => {
        // Set a cookie in the response
        res.cookie('token', cookie, { httpOnly: true });

        // Set custom headers in the response
        res.set('origin', headers.origin);

        EmailController.sendLoginLink(
          req.body.email,
          req.body.auth_origin,
          mockUser.name.firstName,
          jsonToken,
          cookie,
          headers.origin,
        );

        res.status(200).send({ message: 'Signin successful' });
      });

      // Mock implementation for EmailController.sendLoginLink
      EmailController.sendLoginLink.mockImplementation(() => {
        console.log('Mocked EmailController.sendLoginLink called');
      });

      const response = await request.post('/api/auth/signin').send({
        email: email,
        auth_origin: auth_origin,
      });

      // Tests
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
      // Verify that the cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('token=mockedCookie');

      // Marks completion of tests
      done();
    });
  });
});
