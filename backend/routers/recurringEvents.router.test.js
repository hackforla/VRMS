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
// Allow for body parsing of JSON data
testapp.use(express.json());
// Allow for body parsing of HTML data
testapp.use(express.urlencoded({ extended: false }));
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
    it('should return a list of events with GET /api/recurringevents/', async () => {
      // Mock find method with chaining of select and populate methods
      RecurringEvent.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockEvents),
        }),
      });

      const response = await request.get('/api/recurringevents/');

      // Tests
      expect(RecurringEvent.find().select).toHaveBeenCalledWith('-videoConferenceLink');
      expect(RecurringEvent.find().select().populate).toHaveBeenCalledWith('project');
      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });

    it('should return status code 400 when there is an error with GET /api/recurringevents/', async () => {
      // Mock the test error
      const error = new Error('test error');

      // Mock db methods
      RecurringEvent.find.mockImplementationOnce(() => ({
        select: () => ({
          populate: () => Promise.reject(error),
        }),
      }));

      // Creates a spy on console log function to track any calls during test
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/recurringevents/');

      // Tests
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      // Clear console log mock and restore its original function
      consoleLogSpy.mockRestore();
    });

    it('should return a list of events with GET /api/recurringevents/internal', async () => {
      // Mock Mongoose method
      RecurringEvent.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvents),
      });

      const response = await request.get('/api/recurringevents/internal');

      // Tests
      expect(RecurringEvent.find().populate).toHaveBeenCalledWith('project');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });

    it('should return status code 400 when there is an error with GET /api/recurringevents/internal', async () => {
      // Mock the test error
      const error = new Error('test error');

      // Mock error in calling find method
      RecurringEvent.find.mockImplementationOnce(() => ({
        populate: () => Promise.reject(error),
      }));

      // Creates a spy on console log function to track any calls during test
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/recurringevents/internal');

      // Tests
      expect(RecurringEvent.find).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      // Clear console log mock and restore its original function
      consoleLogSpy.mockRestore();
    });

    it('should return a single event by id with GET /api/recurringevents/:id', async () => {
      // Mock event
      const mockEvent = mockEvents[0];
      const { id } = mockEvent;

      // Mock findById method
      RecurringEvent.findById.mockResolvedValue(mockEvent);

      const response = await request.get(`/api/recurringevents/${id}`);

      // Tests
      expect(RecurringEvent.findById).toHaveBeenCalledWith(`${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
    });

    it('should return status code 400 when there is an error with GET /api/recurringevents/:id', async () => {
      // Mock the test error
      const error = new Error('test error');

      // Mock findById method to return a rejected Promise to trigger catch block
      RecurringEvent.findById.mockRejectedValue(error);

      // Creates a spy on console log function to track any calls during test
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/recurringevents/123');

      // Tests
      expect(RecurringEvent.findById).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      // Clear console log mock and restore its original function
      consoleLogSpy.mockRestore();
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

    it('should add a new event with POST /api/recurringevents/', async () => {
      RecurringEventController.create.mockImplementationOnce((req, res) => {
        res.status(200).send(newEvent);
      });

      const response = await request.post('/api/recurringevents/').send(newEvent);

      // Tests
      expect(RecurringEventController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newEvent }), // Checks if newEvent was passed
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next object
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newEvent);
    });
  });

  describe('UPDATE', () => {
    it('should update a specific event by id with PATCH /api/recurringevents/:id', async () => {
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
      const { id } = updatedEvent;

      RecurringEventController.update.mockImplementationOnce((req, res) => {
        return res.status(200).send(updatedEvent);
      });

      const response = await request.patch(`/api/recurringevents/${id}`).send(updatedEvent);

      // Tests
      expect(RecurringEventController.update).toHaveBeenCalledWith(
        expect.objectContaining({ body: updatedEvent }), // Checks if newEvent was passed
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next object
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEvent);
    });
  });

  describe('DESTROY', () => {
    it('should delete a specific event by id with DELETE /api/recurringevents/:id', async () => {
      // Mock event to be deleted
      const deleteEvent = mockEvents[0];
      const { id } = deleteEvent;

      RecurringEventController.destroy.mockImplementationOnce((req, res) => {
        return res.status(200).send(deleteEvent);
      });

      const response = await request.delete(`/api/recurringevents/${id}`);

      // Tests
      expect(RecurringEventController.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ params: { RecurringEventId: String(id) } }), // Check for parsing of RecurringEventId
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(deleteEvent);
    });
  });
});
