import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../models/user.model.js');

import { User } from '../models/index.js';
import checkUserRouter from './checkUser.router.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use(express.json());
testapp.use('/api/checkuser', checkUserRouter);
const request = supertest(testapp);

describe('Unit tests for checkUser router', () => {
  const id = '123';
  const mockUser = {
    id,
    name: {
      firstName: 'mock',
      lastName: 'user',
    },
    accessLevel: 'user',
    skillsToMatch: [],
    projects: [],
    textingOk: false,
    managedProjects: [],
    isActive: true,
    email: 'mockuser@gmail.com',
    currentRole: 'Product Owner',
    desiredRole: 'Product Owner',
    newMember: false,
    firstAttended: 'NOV 2015',
    createdDate: '2020-01-14T02:14:22.407Z',
    attendanceReason: 'Civic Engagement',
    currentProject: 'Undebate',
  };

  const auth_origin = 'test-origin';

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('CREATE', () => {
    it('should authenticate user with POST /api/checkuser', async () => {
      User.findOne.mockResolvedValue(mockUser);

      const response = await request
        .post('/api/checkuser')
        .send({ email: 'mockuser@gmail.com', auth_origin });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'mockuser@gmail.com' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, auth_origin: auth_origin });
    });
  });

  describe('READ', () => {
    it('should return a user by id with GET /api/checkuser/:id', async () => {
      User.findById.mockResolvedValue(mockUser);

      const response = await request.get(`/api/checkuser/${id}`);

      expect(User.findById).toHaveBeenCalledWith(id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });
});
