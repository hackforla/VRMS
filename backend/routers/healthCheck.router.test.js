import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../controllers/healthCheck.controller.js');

import healthCheck from './healthCheck.router.js';
import { HealthCheckController } from '../controllers/index.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use('/api/healthcheck', healthCheck);
const request = supertest(testapp);

describe('Unit testing for Health Check Router', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('READ', () => {
    it('should return status code 200 and message "I\'m Alive" with GET /api/healthcheck', async () => {
      HealthCheckController.isAlive.mockImplementationOnce((req, res) => {
        res.status(200).send("I'm Alive!");
      });

      const response = await request.get('/api/healthcheck');

      expect(HealthCheckController.isAlive).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.text).toBe("I'm Alive!");
    });
  });
});
