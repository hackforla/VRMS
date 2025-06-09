const express = require('express');

const supertest = require('supertest');

// Mock the Event model (only used by the non-refactored route directly in the router)

// Path corrected to go up one directory (backend/) then down into models/

jest.mock('../models/event.model', () => ({
  Event: {
    find: jest.fn(),

    // populate, then, and catch will be defined directly on the mock returned by find()

    // within the test cases for the direct router route to handle chaining.

    // For controller-driven routes, the controller itself is mocked.
  },
}));

const { Event } = require('../models/event.model'); // Path corrected

// Mock the EventController

// Path corrected to go up one directory (backend/) then down into controllers/

jest.mock('../controllers', () => ({
  EventController: {
    event_list: jest.fn(),

    create: jest.fn(),

    event_by_id: jest.fn(),

    destroy: jest.fn(),

    update: jest.fn(),
  },
}));

const { EventController } = require('../controllers'); // Path corrected

// Must import eventsRouter after setting up mocks for EventController

// Path is relative to the current directory (routers/)

const eventsRouter = require('./events.router');

// Setup testapp with just eventsRouter which calls mocked EventController

const testapp = express();

testapp.use(express.json());

testapp.use(express.urlencoded({ extended: false }));

testapp.use('/api/events', eventsRouter);

const request = supertest(testapp);

describe('Unit Tests for events.router.js', () => {
  // Mock event data for consistent testing

  const mockEvent = {
    _id: 'event123',

    name: 'Test Event',

    project: 'projectABC',

    date: '2025-01-01T10:00:00Z',
  };

  const mockEventId = 'event123';

  const mockProjectId = 'projectABC';

  const mockUpdatedEventData = {
    name: 'Updated Test Event Name',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/events (event_list)', () => {
    it('should call EventController.event_list and return a list of events', async (done) => {
      // Setup

      EventController.event_list.mockImplementationOnce((req, res) =>
        res.status(200).send([mockEvent]),
      );

      // Functionality

      const response = await request.get('/api/events');

      // Test

      expect(EventController.event_list).toHaveBeenCalledWith(
        expect.anything(), // req

        expect.anything(), // res

        expect.anything(), // next
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual([mockEvent]);

      done();
    });
  });

  describe('POST /api/events (create)', () => {
    it('should call EventController.create and return the created event', async (done) => {
      // Setup

      EventController.create.mockImplementationOnce((req, res) => res.status(201).send(mockEvent));

      // Functionality

      const newEventData = {
        name: 'New Event',

        project: 'projectXYZ',

        date: '2025-02-01T10:00:00Z',
      };

      const response = await request.post('/api/events/').send(newEventData);

      // Test

      expect(EventController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newEventData }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(201);

      expect(response.body).toEqual(mockEvent);

      done();
    });
  });

  describe('GET /api/events/:EventId (event_by_id)', () => {
    it('should call EventController.event_by_id and return a specific event', async (done) => {
      // Setup

      EventController.event_by_id.mockImplementationOnce((req, res) =>
        res.status(200).send(mockEvent),
      );

      // Functionality

      const response = await request.get(`/api/events/${mockEventId}`);

      // Test

      expect(EventController.event_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual(mockEvent);

      done();
    });
  });

  describe('DELETE /api/events/:EventId (destroy)', () => {
    it('should call EventController.destroy and return 204 No Content', async (done) => {
      // Setup

      EventController.destroy.mockImplementationOnce((req, res) => res.status(204).send());

      // Functionality

      const response = await request.delete(`/api/events/${mockEventId}`);

      // Test

      expect(EventController.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(204);

      expect(response.body).toEqual({}); // 204 responses typically have an empty body

      done();
    });
  });

  describe('PATCH /api/events/:EventId (update)', () => {
    it('should call EventController.update and return the updated event', async (done) => {
      // Setup

      EventController.update.mockImplementationOnce((req, res) =>
        res.status(200).send({ ...mockEvent, ...mockUpdatedEventData }),
      );

      // Functionality

      const response = await request.patch(`/api/events/${mockEventId}`).send(mockUpdatedEventData);

      // Test

      expect(EventController.update).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { EventId: mockEventId },

          body: mockUpdatedEventData,
        }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual({ ...mockEvent, ...mockUpdatedEventData });

      done();
    });
  });

  // TODO: Refactor and remove - Direct route implementation testing

  describe('GET /api/events/nexteventbyproject/:id', () => {
    it('should return the last event for a given project ID directly from the router', async (done) => {
      // Setup

      const mockEventsForProject = [
        { _id: 'eventA', project: mockProjectId, name: 'Event A' },

        { _id: 'eventB', project: mockProjectId, name: 'Event B' },

        { _id: 'eventC', project: mockProjectId, name: 'Event C' },
      ];

      // Corrected Mongoose chaining mock for Event.find().populate().then()

      Event.find.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(), // Returns 'this' (the mock object itself)

        then: jest.fn(function (callback) {
          // This allows .then() to be called on the result of .populate()

          // and resolves the promise with the mock data.

          return Promise.resolve(callback(mockEventsForProject));
        }),

        catch: jest.fn(), // A no-op catch for success scenario
      }));

      // Functionality

      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);

      // Test

      expect(Event.find).toHaveBeenCalledWith({ project: mockProjectId });

      // To test the populate call on the chained mock, we need to get the mock instance

      // that was returned by Event.find() and check its populate method.

      // Event.find.mock.results[0].value gives us the object returned by the first call to Event.find.

      expect(Event.find.mock.results[0].value.populate).toHaveBeenCalledWith('project');

      expect(response.status).toBe(200);

      expect(response.body).toEqual(mockEventsForProject[mockEventsForProject.length - 1]);

      done();
    });

    it('should return 500 if an error occurs when fetching next event by project', async (done) => {
      // Setup

      const mockError = new Error('Simulated database error for next event by project');

      // Corrected Mongoose chaining mock for Event.find().populate().then().catch()

      Event.find.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),

        then: jest.fn(() => Promise.reject(mockError)), // Simulate rejection

        catch: jest.fn(function (callback) {
          // The catch block in the router should handle the rejection.

          // This mock ensures that the catch callback is invoked.

          return Promise.resolve(callback(mockError)); // You might want to return Promise.reject(mockError)

          // if you want to ensure the error propagates for other tests,

          // but here we just ensure the callback is hit.
        }),
      }));

      // Functionality

      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);

      // Test

      expect(Event.find).toHaveBeenCalledWith({ project: mockProjectId });

      expect(Event.find.mock.results[0].value.populate).toHaveBeenCalledWith('project');

      expect(response.status).toBe(500);

      // No specific body expected for a 500, just the status

      done();
    });
  });
});
