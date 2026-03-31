// Mock the healthCheck controller
jest.mock('../controllers/healthCheck.controller.js');

// Import the healthCheck router and controller
const healthCheck = require('./healthCheck.router.js');
const { HealthCheckController } = require('../controllers');

// Create a mock test server
const express = require('express');
const supertest = require('supertest');
const testapp = express();
testapp.use('/api/healthcheck', healthCheck);

// Set up mock request for the controller
const request = supertest(testapp);

describe('Unit testing for Health Check Router', () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('READ', () => {
    it('should return status code 200 and message "I\'m Alive" with GET /api/healthcheck', async () => {
      // Mock the controller method
      HealthCheckController.isAlive.mockImplementationOnce((req, res) => {
        res.status(200).send("I'm Alive!");
      });

      // Call GET API endpoint
      const response = await request.get('/api/healthcheck');

      // Test
      expect(HealthCheckController.isAlive).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toBe("I'm Alive!");
    });
  });
});
