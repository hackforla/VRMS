import cookieParser from 'cookie-parser';
import express from 'express';
import supertest from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { RefreshTokenV2 } from '../models/refreshTokenV2.model.ts';
import { User } from '../models/user.model.js';
import { setupIntegrationDB } from '../setup-test.js';
import authV2Router from './auth-v2.router.ts';

setupIntegrationDB('api-auth-v2');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth/v2', authV2Router);
const request = supertest(app);

const COOKIE = 'vrms_refresh_v2';
const credentials = {
  email: 'Volunteer@Example.com',
  username: 'Volunteer',
  password: 'correct horse battery',
};

function setCookieHeader(res: supertest.Response): string {
  const header = (res.headers['set-cookie'] as unknown as string[] | undefined)?.find((c) =>
    c.startsWith(`${COOKIE}=`),
  );
  if (!header) throw new Error('response did not set the refresh cookie');
  return header;
}

function refreshTokenFrom(res: supertest.Response): string {
  return setCookieHeader(res)
    .split(';')[0]
    .slice(COOKIE.length + 1);
}

const refreshWith = (token: string) =>
  request.post('/api/auth/v2/refresh').set('Cookie', `${COOKIE}=${token}`);

beforeAll(async () => {
  process.env.AUTH_V2_BCRYPT_ROUNDS = '4'; // keep the suite fast; production default is 12
});

describe('when Login v2 is not configured', () => {
  test('every route refuses with 503 and the app keeps working', async () => {
    Reflect.deleteProperty(process.env, 'AUTH_V2_ACCESS_TOKEN_SECRET');
    for (const [method, path] of [
      ['post', '/signup'],
      ['post', '/signin'],
      ['post', '/refresh'],
      ['post', '/logout'],
      ['get', '/me'],
    ] as const) {
      const res = await request[method](`/api/auth/v2${path}`);
      expect(res.status, path).toBe(503);
      expect(res.body.error).toMatch(/not configured/i);
    }
  });

  test('a secret shorter than 32 characters counts as not configured', async () => {
    process.env.AUTH_V2_ACCESS_TOKEN_SECRET = 'too-short';
    expect((await request.post('/api/auth/v2/signin')).status).toBe(503);
  });
});

describe('Login v2', () => {
  beforeEach(async () => {
    process.env.AUTH_V2_ACCESS_TOKEN_SECRET = 'test-secret-that-is-at-least-32-characters-long';
    await User.deleteMany({});
    await RefreshTokenV2.deleteMany({});
  });
  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('sign-up', () => {
    test('creates an account and starts a session', async () => {
      const res = await request.post('/api/auth/v2/signup').send(credentials);

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.user).toMatchObject({
        email: 'volunteer@example.com',
        username: 'volunteer',
        accessLevel: 'user',
      });
      expect(JSON.stringify(res.body)).not.toContain('passwordHash');
      expect(JSON.stringify(res.body)).not.toContain(credentials.password);
      expect(res.body.refreshToken).toBeUndefined(); // the refresh token is only ever in the cookie
    });

    test('stores a bcrypt hash, never the password', async () => {
      await request.post('/api/auth/v2/signup').send(credentials);
      const stored = await User.findOne({ email: 'volunteer@example.com' }).select('+passwordHash');
      expect(stored?.passwordHash).toMatch(/^\$2[aby]\$04\$/);
      expect(stored?.passwordHash).not.toContain(credentials.password);
    });

    test('rejects duplicates, bad emails and bad passwords', async () => {
      await request.post('/api/auth/v2/signup').send(credentials);

      expect(
        (await request.post('/api/auth/v2/signup').send({ ...credentials, username: 'other' }))
          .status,
      ).toBe(409);
      expect(
        (
          await request
            .post('/api/auth/v2/signup')
            .send({ ...credentials, email: 'new@example.com' })
        ).status,
      ).toBe(409);
      expect(
        (await request.post('/api/auth/v2/signup').send({ ...credentials, email: 'nope' })).status,
      ).toBe(400);
      expect(
        (
          await request
            .post('/api/auth/v2/signup')
            .send({ ...credentials, email: 'a@b.co', username: 'x@y' })
        ).status,
      ).toBe(400);
      expect(
        (
          await request
            .post('/api/auth/v2/signup')
            .send({ ...credentials, email: 'a@b.co', password: 'short' })
        ).status,
      ).toBe(400);
      expect(
        (
          await request
            .post('/api/auth/v2/signup')
            .send({ ...credentials, email: 'a@b.co', password: 'x'.repeat(73) })
        ).status,
      ).toBe(400);
    });

    test('username is optional', async () => {
      const first = await request
        .post('/api/auth/v2/signup')
        .send({ email: 'a@example.com', password: credentials.password });
      const second = await request
        .post('/api/auth/v2/signup')
        .send({ email: 'b@example.com', password: credentials.password });
      expect([first.status, second.status]).toEqual([201, 201]);
    });
  });

  describe('sign-in', () => {
    beforeEach(async () => {
      await request.post('/api/auth/v2/signup').send(credentials);
    });

    test('accepts the right password with an email or a username', async () => {
      for (const identifier of ['volunteer@example.com', 'VOLUNTEER@example.com', 'volunteer']) {
        const res = await request
          .post('/api/auth/v2/signin')
          .send({ identifier, password: credentials.password });
        expect(res.status, identifier).toBe(200);
        expect(res.body.accessToken).toEqual(expect.any(String));
        expect(refreshTokenFrom(res)).toBeTruthy();
      }
    });

    test('rejects a wrong password, an unknown account and a missing password the same way', async () => {
      const wrong = await request
        .post('/api/auth/v2/signin')
        .send({ identifier: 'volunteer', password: 'wrong password!!' });
      const unknown = await request
        .post('/api/auth/v2/signin')
        .send({ identifier: 'nobody', password: credentials.password });

      expect(wrong.status).toBe(401);
      expect(unknown.status).toBe(401);
      expect(unknown.body).toEqual(wrong.body);
      expect(wrong.headers['set-cookie']).toBeUndefined();
      expect(
        (await request.post('/api/auth/v2/signin').send({ identifier: 'volunteer' })).status,
      ).toBe(400);
    });

    test('an existing user without a password (current login flow) cannot sign in', async () => {
      await User.create({ email: 'magic@example.com', name: { firstName: 'Mag', lastName: 'Ic' } });
      const res = await request
        .post('/api/auth/v2/signin')
        .send({ identifier: 'magic@example.com', password: 'anything at all' });
      expect(res.status).toBe(401);
    });

    test('an inactive account cannot sign in', async () => {
      await User.updateOne({ email: 'volunteer@example.com' }, { isActive: false });
      const res = await request
        .post('/api/auth/v2/signin')
        .send({ identifier: 'volunteer', password: credentials.password });
      expect(res.status).toBe(401);
    });
  });

  describe('refresh cookie', () => {
    test('is httpOnly, SameSite=Strict, scoped to the v2 path and expires in 30 days', async () => {
      const res = await request.post('/api/auth/v2/signup').send(credentials);
      const header = setCookieHeader(res);

      expect(header).toMatch(/;\s*HttpOnly/i);
      expect(header).toMatch(/;\s*SameSite=Strict/i);
      expect(header).toMatch(/;\s*Path=\/api\/auth\/v2(;|$)/);
      expect(header).toMatch(/;\s*Max-Age=2592000/);
      expect(header).not.toMatch(/;\s*Secure/i); // NODE_ENV is "test"
    });

    test('is Secure in production', async () => {
      process.env.NODE_ENV = 'production';
      const res = await request.post('/api/auth/v2/signup').send(credentials);
      expect(setCookieHeader(res)).toMatch(/;\s*Secure/i);
    });
  });

  describe('access token', () => {
    test('opens /me, and nothing else does', async () => {
      const signUp = await request.post('/api/auth/v2/signup').send(credentials);

      const ok = await request
        .get('/api/auth/v2/me')
        .set('Authorization', `Bearer ${signUp.body.accessToken}`);
      expect(ok.status).toBe(200);
      expect(ok.body.user.email).toBe('volunteer@example.com');

      expect((await request.get('/api/auth/v2/me')).status).toBe(401);
      expect(
        (
          await request
            .get('/api/auth/v2/me')
            .set('Authorization', `Bearer ${signUp.body.accessToken}x`)
        ).status,
      ).toBe(401);
      // The refresh token is not an access token.
      expect(
        (
          await request
            .get('/api/auth/v2/me')
            .set('Authorization', `Bearer ${refreshTokenFrom(signUp)}`)
        ).status,
      ).toBe(401);
    });
  });

  describe('refresh rotation', () => {
    test('trades a refresh token for a new access token and a new refresh token', async () => {
      const signUp = await request.post('/api/auth/v2/signup').send(credentials);
      const first = refreshTokenFrom(signUp);

      const res = await refreshWith(first);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('volunteer@example.com');
      expect(res.body.accessToken).toEqual(expect.any(String));
      const second = refreshTokenFrom(res);
      expect(second).not.toBe(first);

      const me = await request
        .get('/api/auth/v2/me')
        .set('Authorization', `Bearer ${res.body.accessToken}`);
      expect(me.status).toBe(200);
      expect((await refreshWith(second)).status).toBe(200); // the new token works
    });

    test('an old refresh token cannot be used again', async () => {
      const first = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));
      await refreshWith(first);

      const replay = await refreshWith(first);
      expect(replay.status).toBe(401);
      expect(replay.body.accessToken).toBeUndefined();
    });

    test('replaying an old token after the grace window ends the whole session', async () => {
      const first = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));
      const second = refreshTokenFrom(await refreshWith(first));

      await RefreshTokenV2.updateMany(
        { usedAt: { $ne: null } },
        { usedAt: new Date(Date.now() - 60_000) },
      );

      const replay = await refreshWith(first);
      expect(replay.status).toBe(401);
      expect(replay.body.error).toMatch(/already used/i);
      expect((await refreshWith(second)).status).toBe(401); // the thief's and the owner's tokens are both dead
      expect(await RefreshTokenV2.countDocuments()).toBe(0);
    });

    test('a quick replay (second tab) is refused but keeps the session alive', async () => {
      const first = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));
      const second = refreshTokenFrom(await refreshWith(first));

      expect((await refreshWith(first)).status).toBe(401);
      expect((await refreshWith(second)).status).toBe(200);
    });

    test('rejects a missing, made-up or expired token', async () => {
      const signUp = await request.post('/api/auth/v2/signup').send(credentials);
      expect((await request.post('/api/auth/v2/refresh')).status).toBe(401);
      expect((await refreshWith('not-a-real-token')).status).toBe(401);

      await RefreshTokenV2.updateMany({}, { expiresAt: new Date(Date.now() - 1000) });
      expect((await refreshWith(refreshTokenFrom(signUp))).status).toBe(401);
    });

    test('stops working once the account is deactivated', async () => {
      const first = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));
      await User.updateOne({ email: 'volunteer@example.com' }, { isActive: false });
      expect((await refreshWith(first)).status).toBe(401);
    });
  });

  describe('logout', () => {
    test('revokes the refresh token and clears the cookie', async () => {
      const token = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));

      const res = await request.post('/api/auth/v2/logout').set('Cookie', `${COOKIE}=${token}`);
      expect(res.status).toBe(204);
      expect(setCookieHeader(res)).toMatch(
        new RegExp(`^${COOKIE}=;.*Path=/api/auth/v2.*(Expires=Thu, 01 Jan 1970|Max-Age=0)`, 'i'),
      );

      expect((await refreshWith(token)).status).toBe(401);
      expect(await RefreshTokenV2.countDocuments()).toBe(0);
    });

    test('revokes tokens already rotated in the same sign-in, and only that sign-in', async () => {
      const phone = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));
      const laptop = refreshTokenFrom(
        await request
          .post('/api/auth/v2/signin')
          .send({ identifier: 'volunteer', password: credentials.password }),
      );
      const phoneRotated = refreshTokenFrom(await refreshWith(phone));

      await request.post('/api/auth/v2/logout').set('Cookie', `${COOKIE}=${phoneRotated}`);

      expect((await refreshWith(phoneRotated)).status).toBe(401);
      expect((await refreshWith(laptop)).status).toBe(200);
    });

    test('is harmless without a session', async () => {
      expect((await request.post('/api/auth/v2/logout')).status).toBe(204);
    });
  });

  test('refresh tokens are stored hashed, with a TTL index on expiresAt', async () => {
    const token = refreshTokenFrom(await request.post('/api/auth/v2/signup').send(credentials));
    const stored = await RefreshTokenV2.findOne();
    expect(stored?.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(stored?.hash).not.toBe(token);

    await RefreshTokenV2.init();
    const indexes = await RefreshTokenV2.collection.indexes();
    expect(indexes.some((i) => i.key.expiresAt === 1 && i.expireAfterSeconds === 0)).toBe(true);
  });
});
