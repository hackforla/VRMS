import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../models/checkIn.model.js');

import { CheckIn } from '../models/index.js';
import checkInsRouter from './checkIns.router.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use(express.json());
testapp.use('/api/checkins', checkInsRouter);
const request = supertest(testapp);

describe('Unit tests for checkIns router', () => {
  const mockCheckIns = [
    { id: 1, eventId: 'event1', userId: 'user1', checkedIn: true, createdDate: String(new Date()) },
    { id: 2, eventId: 'event2', userId: 'user2', checkedIn: true, createdDate: String(new Date()) },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('READ', () => {
    it('should return a list of check-ins with GET /api/checkins', async () => {
      CheckIn.find.mockResolvedValue(mockCheckIns);

      const response = await request.get('/api/checkins');

      expect(CheckIn.find).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCheckIns);
    });

    it('should return a single check-in by id with GET /api/checkins/:id', async () => {
      CheckIn.findById.mockResolvedValue(mockCheckIns[0]);

      const response = await request.get('/api/checkins/1');

      expect(CheckIn.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCheckIns[0]);
    });

    it('should return a list of users who have checked into a specific event with GET /api/checkins/findEvent/:id', async () => {
      const mockCheckIn = mockCheckIns[1];
      const { eventId } = mockCheckIn;

      CheckIn.find.mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockCheckIn),
      });

      const response = await request.get(`/api/checkins/findEvent/${eventId}`);

      expect(CheckIn.find).toHaveBeenCalledWith({
        eventId: eventId,
        userId: { $ne: 'undefined' },
      });
      expect(CheckIn.find().populate).toHaveBeenCalledWith({ path: 'userId', model: 'User' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCheckIn);
    });
  });

  describe('CREATE', () => {
    it('should create a new check-in with POST /api/checkins', async () => {
      const newCheckIn = {
        id: 3,
        eventId: 'event3',
        userId: 'user3',
        checkedIn: true,
        createdDate: String(new Date()),
      };

      CheckIn.create.mockResolvedValue(newCheckIn);

      const response = await request.post('/api/checkins').send(newCheckIn);

      expect(CheckIn.create).toHaveBeenCalledWith(newCheckIn);
      expect(response.status).toBe(201);
    });
  });
});
