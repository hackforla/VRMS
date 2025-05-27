// Mock and import CheckIn model
jest.mock('../models/checkIn.model');
const { CheckIn } = require('../models');

// Import the check-ins router
const express = require('express');
const supertest = require('supertest');
const checkInsRouter = require('./checkIns.router');

// Create a new Express application for testing
const testapp = express();
// Allows for body parsing
testapp.use(express.json());
testapp.use('/api/checkins', checkInsRouter);
const request = supertest(testapp);

describe('Unit tests for checkIns router', () => {
  // Mock data for check-ins
  const mockCheckIns = [
    { id: 1, eventId: 'event1', userId: 'user1', checkedIn: true, createdDate: String(new Date()) },
    { id: 2, eventId: 'event2', userId: 'user2', checkedIn: true, createdDate: String(new Date()) },
  ];

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('READ', () => {
    it('should return a list of check-ins with GET /api/checkins', async (done) => {
      // Mock Mongoose method
      CheckIn.find.mockResolvedValue(mockCheckIns);

      const response = await request.get('/api/checkins');

      // Tests
      expect(CheckIn.find).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCheckIns);

      // Marks completion of test
      done();
    });

    it('should return a single check-in by id with GET /api/checkins/:id', async (done) => {
      // Mock Mongoose method
      CheckIn.findById.mockResolvedValue(mockCheckIns[0]);

      const response = await request.get('/api/checkins/1');

      // Tests
      expect(CheckIn.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCheckIns[0]);

      // Marks completion of test
      done();
    });

    it('should return a list of users who have checked into a specific event with GET /api/checkins/findEvent/:id', async (done) => {
      // Mock specific checkIn
      const mockCheckIn = mockCheckIns[1];
      const { eventId } = mockCheckIn;

      // Mock Mongoose methods
      CheckIn.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCheckIn),
      });

      const response = await request.get(`/api/checkins/findEvent/${eventId}`);

      // Tests
      expect(CheckIn.find).toHaveBeenCalledWith({
        eventId: eventId,
        userId: { $ne: 'undefined' },
      });
      expect(CheckIn.find().populate).toHaveBeenCalledWith({ path: 'userId', model: 'User' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCheckIn);

      // Marks completion of test
      done();
    });
  });

  describe('CREATE', () => {
    it('should create a new check-in with POST /api/checkins', async (done) => {
      // Mock new check-in data
      const newCheckIn = {
        id: 3,
        eventId: 'event3',
        userId: 'user3',
        checkedIn: true,
        createdDate: String(new Date()),
      };

      // Mock create method
      CheckIn.create.mockResolvedValue(newCheckIn);

      const response = await request.post('/api/checkins').send(newCheckIn);

      // Tests
      expect(CheckIn.create).toHaveBeenCalledWith(newCheckIn);
      expect(response.status).toBe(201);

      // Marks completion of test
      done();
    });
  });
});
