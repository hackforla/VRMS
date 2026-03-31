const express = require('express');

const supertest = require('supertest');
// Mock the Mongoose Event model
jest.mock('../models/event.model', () => ({
  Event: {
    find: jest.fn(),
  },
}));

const { Event } = require('../models/event.model');
//Mock the EventController to isolate router tests router tests fro controller logic
jest.mock('../controllers', () => ({
  EventController: {
    event_list: jest.fn(),

    create: jest.fn(),

    event_by_id: jest.fn(),

    destroy: jest.fn(),

    update: jest.fn(),
  },
}));

const { EventController } = require('../controllers');

const eventsRouter = require('./events.router');
//Setup a test application
const testapp = express();

testapp.use(express.json());

testapp.use(express.urlencoded({ extended: false }));

testapp.use('/api/events', eventsRouter);

const request = supertest(testapp);

describe('Unit Tests for events.router.js', () => {
  //Mock data
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
  // Test suite for GET /api/events (event_list)

  describe('GET /api/events (event_list)', () => {
    it('should call EventController.event_list and return a list of events', async () => {
      EventController.event_list.mockImplementationOnce((req, res) =>
        res.status(200).send([mockEvent]),
      );

      const response = await request.get('/api/events');

      expect(EventController.event_list).toHaveBeenCalledWith(
        expect.anything(),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual([mockEvent]);

    });
  });
  // Test suite for POST /api/events (create)
  describe('POST /api/events (create)', () => {
    it('should call EventController.create and return the created event', async () => {
      EventController.create.mockImplementationOnce((req, res) => res.status(201).send(mockEvent));

      const newEventData = {
        name: mockEvent.name,

        project: mockEvent.project,

        date: mockEvent.date,
      };

      const response = await request.post('/api/events/').send(newEventData);

      expect(EventController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newEventData }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(201);

      expect(response.body).toEqual(mockEvent);

    });
  });
  // Test suite for GET /api/events/:EventId (event_by_id)
  describe('GET /api/events/:EventId (event_by_id)', () => {
    it('should call EventController.event_by_id and return a specific event', async () => {
      EventController.event_by_id.mockImplementationOnce((req, res) =>
        res.status(200).send(mockEvent),
      );

      const response = await request.get(`/api/events/${mockEventId}`);

      expect(EventController.event_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(200);

      expect(response.body).toEqual(mockEvent);

    });
  });
  // Test suite for DELETE /api/events/:EventId (destroy)
  describe('DELETE /api/events/:EventId (destroy)', () => {
    it('should call EventController.destroy and return 204 No Content', async () => {
      EventController.destroy.mockImplementationOnce((req, res) => res.status(204).send());

      const response = await request.delete(`/api/events/${mockEventId}`);

      expect(EventController.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(204);

      expect(response.body).toEqual({});

    });
  });
  // Test suite for PATCH /api/events/:EventId (update)
  describe('PATCH /api/events/:EventId (update)', () => {
    it('should call EventController.update and return the updated event', async () => {
      EventController.update.mockImplementationOnce((req, res) =>
        res.status(200).send({ ...mockEvent, ...mockUpdatedEventData }),
      );

      const response = await request.patch(`/api/events/${mockEventId}`).send(mockUpdatedEventData);

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

    });
  });
  // Test suite for GET /api/events/nexteventbyproject/:id
  describe('GET /api/events/nexteventbyproject/:id', () => {
    it('should return the last event for a given project ID directly from the router', async () => {
      const mockEventsForProject = [
        { _id: 'eventA', project: mockProjectId, name: 'Event A' },

        { _id: 'eventB', project: mockProjectId, name: 'Event B' },

        { _id: 'eventC', project: mockProjectId, name: 'Event C' },
      ];

      Event.find.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),

        then: jest.fn(function (callback) {
          return Promise.resolve(callback(mockEventsForProject));
        }),

        catch: jest.fn(),
      }));

      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);

      expect(Event.find).toHaveBeenCalledWith({ project: mockProjectId });

      expect(Event.find.mock.results[0].value.populate).toHaveBeenCalledWith('project');

      expect(response.status).toBe(200);

      expect(response.body).toEqual(mockEventsForProject[mockEventsForProject.length - 1]);

    });
    // Test case for error handling when fetching next event by project
    it('should return 500 if an error occurs when fetching next event by project', async () => {
      const mockError = new Error('Simulated database error for next event by project');

      Event.find.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),

        then: jest.fn(() => Promise.reject(mockError)),

        catch: jest.fn(function (callback) {
          return Promise.resolve(callback(mockError));
        }),
      }));

      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);

      expect(response.status).toBe(500);

    });
  });
});
