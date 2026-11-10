import cookieParser from 'cookie-parser';
import express from 'express';
import supertest from 'supertest';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { setupIntegrationDB } from '../setup-test.js';
import authV2Router from './auth-v2.router.ts';

setupIntegrationDB('api-auth-v2-rate-limit');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth/v2', authV2Router);
const server = app.listen(0);
const request = supertest(server);
afterAll(() => new Promise((resolve) => server.close(resolve)));

// Each test signs in from its own client address, as forwarded by the proxy.
const from = (ip: string) => ({
  post: (path: string) => request.post(path).set('X-Forwarded-For', ip),
});

beforeAll(() => {
  process.env.AUTH_V2_ACCESS_TOKEN_SECRET = 'test-secret-that-is-at-least-32-characters-long';
  process.env.AUTH_V2_BCRYPT_ROUNDS = '4';
  process.env.AUTH_V2_SIGNIN_LIMIT = '3';
});

test('only failed sign-in and sign-up attempts from one IP are capped', async () => {
  const client = from('203.0.113.1');
  const password = 'correct horse battery';
  const signIn = (attempt: string) =>
    client.post('/api/auth/v2/signin').send({ identifier: 'volunteer', password: attempt });

  expect(
    (
      await client
        .post('/api/auth/v2/signup')
        .send({ email: 'someone@example.com', username: 'volunteer', password })
    ).status,
  ).toBe(201);
  for (let i = 0; i < 5; i++) expect((await signIn(password)).status).toBe(200);

  expect((await signIn('guess-1')).status).toBe(401);
  expect((await signIn('guess-2')).status).toBe(401);
  expect(
    (await client.post('/api/auth/v2/signup').send({ email: 'someone@example.com', password }))
      .status,
  ).toBe(409);

  const blocked = await signIn(password);
  expect(blocked.status).toBe(429);
  expect(blocked.body.error).toMatch(/too many/i);
  expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);

  const blockedSignup = await client
    .post('/api/auth/v2/signup')
    .send({ email: 'other@example.com', password });
  expect(blockedSignup.status).toBe(429);

  expect((await client.post('/api/auth/v2/refresh')).status).toBe(401);
  expect((await client.post('/api/auth/v2/logout')).status).toBe(204);
});

test('parallel guesses from one IP cannot all get past the limit', async () => {
  const client = from('203.0.113.2');
  const guesses = await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      client.post('/api/auth/v2/signin').send({ identifier: 'nobody', password: `guess-${i}` }),
    ),
  );
  const statuses = guesses.map((res) => res.status);
  expect(statuses.filter((status) => status === 401)).toHaveLength(3);
  expect(statuses.filter((status) => status === 429)).toHaveLength(9);
});

test('parallel successful sign-ins do not use up the limit', async () => {
  const client = from('203.0.113.3');
  const password = 'correct horse battery';
  expect(
    (
      await client
        .post('/api/auth/v2/signup')
        .send({ email: 'parallel@example.com', username: 'parallel', password })
    ).status,
  ).toBe(201);

  for (let round = 0; round < 3; round++) {
    const signIns = await Promise.all(
      Array.from({ length: 3 }, () =>
        client.post('/api/auth/v2/signin').send({ identifier: 'parallel', password }),
      ),
    );
    expect(signIns.map((res) => res.status)).toEqual([200, 200, 200]);
  }

  for (let i = 0; i < 3; i++) {
    expect(
      (await client.post('/api/auth/v2/signin').send({ identifier: 'parallel', password: 'nope' }))
        .status,
    ).toBe(401);
  }
  expect(
    (await client.post('/api/auth/v2/signin').send({ identifier: 'parallel', password })).status,
  ).toBe(429);
});
