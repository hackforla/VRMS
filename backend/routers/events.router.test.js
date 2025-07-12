const express = require('express');

const supertest = require('supertest');

jest.mock('../models/event.model', () => ({
  Event: {
    find: jest.fn(),
  },
}));

const { Event } = require('../models/event.model');

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

const testapp = express();

testapp.use(express.json());

testapp.use(express.urlencoded({ extended: false }));

testapp.use('/api/events', eventsRouter);

const request = supertest(testapp);

describe('Unit Tests for events.router.js', () => {
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

      done();
    });
  });

  describe('POST /api/events (create)', () => {
    it('should call EventController.create and return the created event', async (done) => {
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

      done();
    });
  });

  describe('GET /api/events/:EventId (event_by_id)', () => {
    it('should call EventController.event_by_id and return a specific event', async (done) => {
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

      done();
    });
  });

  describe('DELETE /api/events/:EventId (destroy)', () => {
    it('should call EventController.destroy and return 204 No Content', async (done) => {
      EventController.destroy.mockImplementationOnce((req, res) => res.status(204).send());

      const response = await request.delete(`/api/events/${mockEventId}`);

      expect(EventController.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),

        expect.anything(),

        expect.anything(),
      );

      expect(response.status).toBe(204);

      expect(response.body).toEqual({});

      done();
    });
  });

  describe('PATCH /api/events/:EventId (update)', () => {
    it('should call EventController.update and return the updated event', async (done) => {
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

      done();
    });
  });

  describe('GET /api/events/nexteventbyproject/:id', () => {
    it('should return the last event for a given project ID directly from the router', async (done) => {
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

      done();
    });

    it('should return 500 if an error occurs when fetching next event by project', async (done) => {
      const mockError = new Error('Simulated database error for next event by project');

      Event.find.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),

        then: jest.fn(() => Promise.reject(mockError)),

        catch: jest.fn(function (callback) {
          return Promise.resolve(callback(mockError));
        }),
      }));

      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);

      expect(Event.find).toHaveBeenCalledWith({ project: mockProjectId });

      expect(Event.find.mock.results[0].value.populate).toHaveBeenCalledWith('project');

      expect(response.status).toBe(500);

      done();
    });
  });
});
