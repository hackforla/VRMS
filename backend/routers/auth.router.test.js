// Set up mocks for UserController
const { User } = require('../models/user.model');
const { UserController } = require('../controllers');
const { verifyUser, verifyToken } = require('../middleware');
const { authApiValidator } = require('../validators');

jest.mock('../controllers/user.controller');
jest.mock('../models/user.model');
jest.mock('../middleware/user.middleware');

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

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CREATE', () => {
    // it('should sign up new user with POST /api/auth/signup', async (done) => {
    //   // Mock successful save
    //   User.mockImplementation(() => ({
    //     save: jest.fn().mockImplementationOnce((callback) => {
    //       callback(null, mockUser);
    //     }),
    //   }));

    //   const response = await request.post('/api/auth/signup').send({
    //     name: {
    //       firstName: mockUser.firstName,
    //       lastName: mockUser.lastName,
    //     },
    //     email: mockUser.email.toLowerCase(),
    //   });

    //   // Tests
    //   // expect(UserController.createUser).toHaveBeenCalled();
    //   expect(response.sendStatus).toBe(201);
    //   // expect(response.status).toBe(201);

    //   // Marks completion of tests
    //   done();
    // });

    it('should sign in existing user with POST /api/auth/signin', async (done) => {
      const response = await request
        .post('/api/auth/signin')
        .set('Authorization', 'Bearer valid-token')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'mockuser@gmail.com',
        });

      expect(response.statusCode).toBe(201);
      done();
    })
  });
});
