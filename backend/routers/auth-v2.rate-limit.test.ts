import express from 'express';
import supertest from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import { authV2Handler } from '../middleware/authV2.middleware.ts';
import { resetAuthV2 } from '../services/authV2.service.ts';
import { setupIntegrationDB } from '../setup-test.js';

setupIntegrationDB('api-auth-v2-rate-limit');

const app = express();
app.set('trust proxy', 1);
app.all('/api/auth/v2/*', authV2Handler);
app.use(express.json());
const request = supertest(app);

const ORIGIN = 'http://localhost:3000';
const attempt = (ip: string, forwardedFor?: string) => {
  const req = request
    .post('/api/auth/v2/sign-in/email')
    .set('Origin', ORIGIN)
    .set('X-Forwarded-For', forwardedFor ?? ip);
  return req.send({ email: 'nobody@example.com', password: 'not a real password' });
};

beforeAll(() => {
  process.env.AUTH_V2_SECRET = 'test-secret-that-is-at-least-32-characters-long';
  process.env.AUTH_V2_BASE_URL = ORIGIN;
  process.env.AUTH_V2_SIGNIN_LIMIT = '3';
  resetAuthV2();
});

describe('Login v2 rate limiting', () => {
  test('blocks an address after too many sign-in attempts, and only that address', async () => {
    for (let i = 0; i < 3; i++) expect((await attempt('203.0.113.1')).status).toBe(401);

    const blocked = await attempt('203.0.113.1');
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers['x-retry-after'])).toBeGreaterThan(0);

    expect((await attempt('203.0.113.2')).status).toBe(401); // a different address is untouched
  });

  test('cannot be dodged by sending a made-up X-Forwarded-For chain', async () => {
    // The server trusts one proxy hop: only the last entry (the one a proxy added) counts.
    for (let i = 0; i < 3; i++) {
      expect((await attempt('x', `198.51.100.${i}, 203.0.113.9`)).status).toBe(401);
    }
    expect((await attempt('x', '192.0.2.77, 203.0.113.9')).status).toBe(429);
  });
});
