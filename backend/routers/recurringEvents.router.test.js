import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../models/recurringEvent.model.js');
vi.mock('../controllers/recurringEvent.controller.js');
// recurringEvents.router imports { Auth } from middleware/index.js
vi.mock('../middleware/index.js', () => ({
  Auth: {
    verifyCookie: vi.fn((req, res, next) => next()),
  },
}));
vi.mock('cors', () => ({
  default: () => (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  },
}));

import { RecurringEvent } from '../models/recurringEvent.model.js';
import { RecurringEventController } from '../controllers/index.js';
import recurringEventsRouter from './recurringEvents.router.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use(express.json());
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/recurringevents', recurringEventsRouter);
const request = supertest(testapp);

describe('Unit tests for RecurringEvents router', () => {
  const mockEvents = [
    {
      id: 1,
      name: 'mockEvent1',
      location: { city: 'city1', state: 'state1', country: 'country1' },
      project: 'project1',
      videoConferenceLink: 'zoom-link1',
    },
    {
      id: 2,
      name: 'mockEvent2',
      location: { city: 'city1', state: 'state1', country: 'country1' },
      project: 'project2',
      videoConferenceLink: 'zoom-link2',
    },
  ];

  afterEach(() => vi.clearAllMocks());

  describe('READ', () => {
    it('should return a list of events with GET /api/recurringevents/', async () => {
      RecurringEvent.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue(mockEvents),
        }),
      });

      const response = await request.get('/api/recurringevents/');

      expect(RecurringEvent.find().select).toHaveBeenCalledWith('-videoConferenceLink');
      expect(RecurringEvent.find().select().populate).toHaveBeenCalledWith('project');
      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });

    it('should return status code 400 when there is an error with GET /api/recurringevents/', async () => {
      const error = new Error('test error');

      RecurringEvent.find.mockImplementationOnce(() => ({
        select: () => ({
          populate: () => Promise.reject(error),
        }),
      }));

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/recurringevents/');

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      consoleLogSpy.mockRestore();
    });

    it('should return a list of events with GET /api/recurringevents/internal', async () => {
      RecurringEvent.find.mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockEvents),
      });

      const response = await request.get('/api/recurringevents/internal');

      expect(RecurringEvent.find().populate).toHaveBeenCalledWith('project');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });

    it('should return status code 400 when there is an error with GET /api/recurringevents/internal', async () => {
      const error = new Error('test error');

      RecurringEvent.find.mockImplementationOnce(() => ({
        populate: () => Promise.reject(error),
      }));

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/recurringevents/internal');

      expect(RecurringEvent.find).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      consoleLogSpy.mockRestore();
    });

    it('should return a single event by id with GET /api/recurringevents/:id', async () => {
      const mockEvent = mockEvents[0];
      const { id } = mockEvent;

      RecurringEvent.findById.mockResolvedValue(mockEvent);

      const response = await request.get(`/api/recurringevents/${id}`);

      expect(RecurringEvent.findById).toHaveBeenCalledWith(`${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
    });

    it('should return status code 400 when there is an error with GET /api/recurringevents/:id', async () => {
      const error = new Error('test error');

      RecurringEvent.findById.mockRejectedValue(error);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/recurringevents/123');

      expect(RecurringEvent.findById).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      consoleLogSpy.mockRestore();
    });
  });

  describe('CREATE', () => {
    const newEvent = {
      id: 3,
      name: 'mockEvent3',
      location: { city: 'city3', state: 'state3', country: 'country3' },
      project: 'project3',
      videoConferenceLink: 'zoom-link3',
    };

    it('should add a new event with POST /api/recurringevents/', async () => {
      RecurringEventController.create.mockImplementationOnce((req, res) => {
        res.status(200).send(newEvent);
      });

      const response = await request.post('/api/recurringevents/').send(newEvent);

      expect(RecurringEventController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newEvent }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newEvent);
    });
  });

  describe('UPDATE', () => {
    it('should update a specific event by id with PATCH /api/recurringevents/:id', async () => {
      const updatedEvent = {
        id: 1,
        name: 'updatedEvent1',
        location: { city: 'update city1', state: 'update state1', country: 'update country1' },
        project: 'update project1',
        videoConferenceLink: 'new zoom-link1',
      };
      const { id } = updatedEvent;

      RecurringEventController.update.mockImplementationOnce((req, res) => {
        return res.status(200).send(updatedEvent);
      });

      const response = await request.patch(`/api/recurringevents/${id}`).send(updatedEvent);

      expect(RecurringEventController.update).toHaveBeenCalledWith(
        expect.objectContaining({ body: updatedEvent }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEvent);
    });
  });

  describe('DESTROY', () => {
    it('should delete a specific event by id with DELETE /api/recurringevents/:id', async () => {
      const deleteEvent = mockEvents[0];
      const { id } = deleteEvent;

      RecurringEventController.destroy.mockImplementationOnce((req, res) => {
        return res.status(200).send(deleteEvent);
      });

      const response = await request.delete(`/api/recurringevents/${id}`);

      expect(RecurringEventController.destroy).toHaveBeenCalledWith(
        expect.objectContaining({ params: { RecurringEventId: String(id) } }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(deleteEvent);
    });
  });
});
