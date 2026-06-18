import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import express from 'express';
import supertest from 'supertest';

// Mock the Mongoose Event model
vi.mock('../models/event.model', () => ({
  Event: {
    find: vi.fn(),
  },
}));

import { Event } from '../models/event.model.js';
//Mock the EventController to isolate router tests
vi.mock('../controllers', () => ({
  EventController: {
    event_list: vi.fn(),
    create: vi.fn(),
    event_by_id: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
  },
}));

const { EventController } = await import('../controllers/index.js');

import eventsRouter from './events.router.js';
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
  const mockUpdatedEventData = { name: 'Updated Test Event Name' };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/events (event_list)', () => {
    it('should call EventController.event_list and return a list of events', async () => {
      EventController.event_list.mockImplementationOnce((req, res) =>
        res.status(200).send([mockEvent]),
      );
      const response = await request.get('/api/events');
      expect(EventController.event_list).toHaveBeenCalledWith(
        expect.anything(), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockEvent]);
    });
  });

  describe('POST /api/events (create)', () => {
    it('should call EventController.create and return the created event', async () => {
      EventController.create.mockImplementationOnce((req, res) => res.status(201).send(mockEvent));
      const newEventData = { name: mockEvent.name, project: mockEvent.project, date: mockEvent.date };
      const response = await request.post('/api/events/').send(newEventData);
      expect(EventController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newEventData }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockEvent);
    });
  });

  describe('GET /api/events/:EventId (event_by_id)', () => {
    it('should call EventController.event_by_id and return a specific event', async () => {
      EventController.event_by_id.mockImplementationOnce((req, res) =>
        res.status(200).send(mockEvent),
      );
      const response = await request.get(`/api/events/${mockEventId}`);
      expect(EventController.event_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),
        expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
    });
  });

  describe('DELETE /api/events/:EventId (destroy)', () => {
    it('should call EventController.destroy and return 204 No Content', async () => {
      EventController.destroy.mockImplementationOnce((req, res) => res.status(204).send());
      const response = await request.delete(`/api/events/${mockEventId}`);
      expect(EventController.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId } }),
        expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  describe('PATCH /api/events/:EventId (update)', () => {
    it('should call EventController.update and return the updated event', async () => {
      EventController.update.mockImplementationOnce((req, res) =>
        res.status(200).send({ ...mockEvent, ...mockUpdatedEventData }),
      );
      const response = await request.patch(`/api/events/${mockEventId}`).send(mockUpdatedEventData);
      expect(EventController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { EventId: mockEventId }, body: mockUpdatedEventData }),
        expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...mockEvent, ...mockUpdatedEventData });
    });
  });

  describe('GET /api/events/nexteventbyproject/:id', () => {
    it('should return the last event for a given project ID directly from the router', async () => {
      const mockEventsForProject = [
        { _id: 'eventA', project: mockProjectId, name: 'Event A' },
        { _id: 'eventB', project: mockProjectId, name: 'Event B' },
        { _id: 'eventC', project: mockProjectId, name: 'Event C' },
      ];
      Event.find.mockImplementationOnce(() => ({
        populate: vi.fn().mockReturnThis(),
        then: vi.fn(function (callback) { return Promise.resolve(callback(mockEventsForProject)); }),
        catch: vi.fn(),
      }));
      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);
      expect(Event.find).toHaveBeenCalledWith({ project: mockProjectId });
      expect(Event.find.mock.results[0].value.populate).toHaveBeenCalledWith('project');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEventsForProject[mockEventsForProject.length - 1]);
    });

    it('should return 500 if an error occurs when fetching next event by project', async () => {
      const mockError = new Error('Simulated database error for next event by project');
      Event.find.mockImplementationOnce(() => ({
        populate: vi.fn().mockReturnThis(),
        then: vi.fn(() => Promise.reject(mockError)),
        catch: vi.fn(function (callback) { return Promise.resolve(callback(mockError)); }),
      }));
      const response = await request.get(`/api/events/nexteventbyproject/${mockProjectId}`);
      expect(response.status).toBe(500);
    });
  });
});
