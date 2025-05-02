// Mock model, controller, middleware, and cors
jest.mock('../models/recurringEvent.model');
jest.mock('../controllers/recurringEvent.controller');
jest.mock('../middleware/auth.middleware', () => ({
  verifyCookie: jest.fn((req, res, next) => next()),
}));
jest.mock('cors', () => () => (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const { RecurringEvent } = require('../models/recurringEvent.model');
const { RecurringEventController } = require('../controllers/');

// Import Recurring Events Router after setting up mocks
const recurringEventsRouter = require('./recurringEvents.router');
const express = require('express');
const testapp = express();
// Allow for body parsing for tests
testapp.use(express.json());
testapp.use('/api/recurringevents', recurringEventsRouter);
const supertest = require('supertest');
const request = supertest(testapp);

describe('Unit tests for RecurringEvents router', () => {
  // Create mock recurring events
  const mockEvents = [
    {
      id: 1,
      name: 'mockEvent1',
      location: {
        city: 'city1',
        state: 'state1',
        country: 'country1',
      },
      project: 'project1',
      videoConferenceLink: 'zoom-link1',
    },
    {
      id: 2,
      name: 'mockEvent2',
      location: {
        city: 'city1',
        state: 'state1',
        country: 'country1',
      },
      project: 'project2',
      videoConferenceLink: 'zoom-link2',
    },
  ];

  // Clear all mocks after each test
  afterEach(() => jest.clearAllMocks());

  describe('READ', () => {
    it('should return a list of events with GET /api/recurringevents/', async (done) => {
      // Mock Mongoose methods, chaining the select and populate methods
      const mockSelectReturn = {
        populate: jest.fn().mockResolvedValue(mockEvents),
      };
      RecurringEvent.find.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelectReturn),
      });

      const response = await request.get('/api/recurringevents/');

      // Tests
      expect(RecurringEvent.find().select).toHaveBeenCalledWith('-videoConferenceLink');
      expect(RecurringEvent.find().select().populate).toHaveBeenCalledWith('project');
      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);

      // Marks completion of tests
      done();
    });

    it('should return a list of events with GET /api/recurringevents/internal', async (done) => {
      // Mock Mongoose method
      RecurringEvent.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvents),
      });

      const response = await request.get('/api/recurringevents/internal');

      // Tests
      expect(RecurringEvent.find().populate).toHaveBeenCalledWith('project');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);

      // Marks completion of tests
      done();
    });

    it('should return a single event by id with GET /api/recurringevents/:id', async (done) => {
      // Mock Mongoose method
      RecurringEvent.findById.mockResolvedValue(mockEvents[0]);

      // Sample id -> mockEvents[0]
      const id = '1';
      const response = await request.get(`/api/recurringevents/${id}`);

      // Tests
      expect(RecurringEvent.findById).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents[0]);

      // Marks completion of tests
      done();
    });
  });

  describe('CREATE', () => {
    // Mock new event
    const newEvent = {
      id: 3,
      name: 'mockEvent3',
      location: {
        city: 'city3',
        state: 'state3',
        country: 'country3',
      },
      project: 'project3',
      videoConferenceLink: 'zoom-link3',
    };

    it('should add a new event with POST /api/recurringevents/', async (done) => {
      RecurringEventController.create.mockImplementationOnce((req, res) => {
        res.status(200).send(newEvent);
      });

      const response = await request.post('/api/recurringevents/').send(newEvent);

      // Tests
      expect(RecurringEventController.create).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newEvent);

      // Marks completion of tests
      done();
    });
  });

  describe('UPDATE', () => {
    it('should update a specific event by id with PATCH /api/recurringevents/:id', async (done) => {
      // Update to event#1
      const updatedEvent = {
        id: 1,
        name: 'updatedEvent1',
        location: {
          city: 'update city1',
          state: 'update state1',
          country: 'update country1',
        },
        project: 'update project1',
        videoConferenceLink: 'new zoom-link1',
      };
      const id = 1;

      RecurringEventController.update.mockImplementationOnce((req, res) => {
        return res.status(200).send(updatedEvent);
      });

      const response = await request.patch(`/api/recurringevents/${id}`).send(updatedEvent);

      // Tests
      expect(RecurringEventController.update).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEvent);

      // Marks completion of tests
      done();
    });
  });

  describe('DESTROY', () => {
    it('should delete a specific event by id with DELETE /api/recurringevents/:id', async (done) => {
      RecurringEventController.destroy.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockEvents[0]);
      });

      const id = 1;
      const response = await request.delete(`/api/recurringevents/${id}`);

      // Tests
      expect(RecurringEventController.destroy).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents[0]);

      // Marks completion of tests
      done();
    });
  });
});
