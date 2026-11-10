import cookieParser from 'cookie-parser';
import express from 'express';
import supertest from 'supertest';
import { beforeAll, expect, test } from 'vitest';
import { setupIntegrationDB } from '../setup-test.js';
import authV2Router from './auth-v2.router.ts';

setupIntegrationDB('api-auth-v2-rate-limit');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth/v2', authV2Router);
const request = supertest(app);

beforeAll(() => {
  process.env.AUTH_V2_ACCESS_TOKEN_SECRET = 'test-secret-that-is-at-least-32-characters-long';
  process.env.AUTH_V2_BCRYPT_ROUNDS = '4';
  process.env.AUTH_V2_SIGNIN_LIMIT = '3';
});

test('sign-in and sign-up attempts from one IP are capped, other routes are not', async () => {
  const guess = (password: string) =>
    request.post('/api/auth/v2/signin').send({ identifier: 'volunteer', password });

  expect((await guess('guess-1')).status).toBe(401);
  expect((await guess('guess-2')).status).toBe(401);
  expect(
    (
      await request
        .post('/api/auth/v2/signup')
        .send({ email: 'someone@example.com', password: 'correct horse battery' })
    ).status,
  ).toBe(201);

  const blocked = await guess('guess-3');
  expect(blocked.status).toBe(429);
  expect(blocked.body.error).toMatch(/too many/i);
  expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);

  const blockedSignup = await request
    .post('/api/auth/v2/signup')
    .send({ email: 'other@example.com', password: 'correct horse battery' });
  expect(blockedSignup.status).toBe(429);

  expect((await request.post('/api/auth/v2/refresh')).status).toBe(401);
  expect((await request.post('/api/auth/v2/logout')).status).toBe(204);
});
