// Mock and import User Model
jest.mock('../models/user.model');
const { User } = require('../models');

// Import checkUser router
const express = require('express');
const supertest = require('supertest');
const checkUserRouter = require('./checkUser.router');

// Create a new Express application for testing
const testapp = express();
testapp.use(express.json());
testapp.use('/api/checkuser', checkUserRouter);
const request = supertest(testapp);

describe('Unit tests for checkUser router', () => {
  // Mock user for test
  const id = '123';
  const mockUser = {
    id,
    name: {
      firstName: 'mock',
      lastName: 'user',
    },
    accessLevel: 'user',
    skillsToMatch: [],
    projects: [],
    textingOk: false,
    managedProjects: [],
    isActive: true,
    email: 'mockuser@gmail.com',
    currentRole: 'Product Owner',
    desiredRole: 'Product Owner',
    newMember: false,
    firstAttended: 'NOV 2015',
    createdDate: '2020-01-14T02:14:22.407Z',
    attendanceReason: 'Civic Engagement',
    currentProject: 'Undebate',
  };

  const auth_origin = 'test-origin';

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CREATE', () => {
    it('should authenticate user with POST /api/checkuser', async (done) => {
      // Mock Mongoose method
      User.findOne.mockResolvedValue(mockUser);

      const response = await request
        .post('/api/checkuser')
        .send({ email: 'mockuser@gmail.com', auth_origin });
      
        // Tests
      expect(User.findOne).toHaveBeenCalledWith({ email: 'mockuser@gmail.com' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, auth_origin: auth_origin });

      // Marks completion of tests
      done();
    });
  });

  describe('READ', () => {
    it('should return a user by id with GET /api/checkuser/:id', async (done) => {
      // Mock Mongoose method
      User.findById.mockResolvedValue(mockUser);

      const response = await request.get(`/api/checkuser/${id}`);

      // Tests
      expect(User.findById).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);

      // Marks completion of tests
      done();
    });
  });
});
