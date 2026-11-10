import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { authV2Handler } from '../middleware/authV2.middleware.ts';
import { User } from '../models/user.model.js';
import { resetAuthV2 } from '../services/authV2.service.ts';
import { setupIntegrationDB } from '../setup-test.js';

setupIntegrationDB('api-auth-v2');

// The same order app.js uses: Login v2 first, the JSON body parser after it.
const app = express();
app.set('trust proxy', 1);
app.all('/api/auth/v2/*', authV2Handler);
app.use(express.json());
const request = supertest(app);

const ORIGIN = 'http://localhost:3000';
const SECRET = 'test-secret-that-is-at-least-32-characters-long';
const credentials = {
  email: 'Volunteer@Example.com',
  username: 'Volunteer',
  name: 'Vera Volunteer',
  password: 'correct horse battery',
};

const post = (path: string, body?: object) =>
  request.post(`/api/auth/v2${path}`).set('Origin', ORIGIN).send(body);
const signUp = (overrides: object = {}) => post('/sign-up/email', { ...credentials, ...overrides });

function cookieFrom(res: supertest.Response): string {
  const header = (res.headers['set-cookie'] as unknown as string[] | undefined)?.find((c) =>
    /^(__Secure-)?vrms-v2\.session_token=/.test(c),
  );
  if (!header) throw new Error('response did not set the session cookie');
  return header;
}
const cookiePair = (res: supertest.Response) => cookieFrom(res).split(';')[0];
const getSession = (cookie?: string) =>
  request.get('/api/auth/v2/get-session').set('Cookie', cookie ?? '');

const collection = (name: string) => {
  const db = mongoose.connection.db;
  if (!db) throw new Error('database is not connected');
  return db.collection(name);
};

function configure() {
  process.env.AUTH_V2_SECRET = SECRET;
  process.env.AUTH_V2_BASE_URL = ORIGIN;
  process.env.AUTH_V2_SIGNIN_LIMIT = '10000'; // this suite signs in far more than a person would
  resetAuthV2();
}

describe('when Login v2 is not configured', () => {
  afterEach(configure);

  test('every route refuses with 503 and the rest of the app keeps working', async () => {
    Reflect.deleteProperty(process.env, 'AUTH_V2_SECRET');
    for (const [method, path] of [
      ['post', '/sign-up/email'],
      ['post', '/sign-in/email'],
      ['post', '/sign-out'],
      ['get', '/get-session'],
    ] as const) {
      const res = await request[method](`/api/auth/v2${path}`);
      expect(res.status, path).toBe(503);
      expect(res.body.error).toMatch(/not configured/i);
    }
  });

  test('a secret shorter than 32 characters counts as not configured', async () => {
    process.env.AUTH_V2_SECRET = 'too-short';
    expect((await post('/sign-in/email', credentials)).status).toBe(503);
  });

  test('so does a missing or malformed base URL', async () => {
    Reflect.deleteProperty(process.env, 'AUTH_V2_BASE_URL');
    expect((await post('/sign-in/email', credentials)).status).toBe(503);
    process.env.AUTH_V2_BASE_URL = 'not a url';
    expect((await post('/sign-in/email', credentials)).status).toBe(503);
  });
});

describe('Login v2', () => {
  beforeEach(async () => {
    configure();
    await User.deleteMany({});
    for (const name of ['authV2Sessions', 'authV2Accounts', 'authV2Verifications']) {
      await collection(name).deleteMany({});
    }
  });

  describe('sign-up', () => {
    test('creates an account and starts a session', async () => {
      const res = await signUp();

      expect(res.status).toBe(200);
      expect(res.body.user).toMatchObject({ email: 'volunteer@example.com' });
      expect(cookiePair(res)).toMatch(/^vrms-v2\.session_token=.+/);
      expect(JSON.stringify(res.body)).not.toContain(credentials.password);
    });

    test('writes a user the Mongoose User model can read', async () => {
      await signUp();

      const person = await User.findOne({ email: 'volunteer@example.com' });
      expect(person).toMatchObject({
        accessLevel: 'user',
        isActive: true,
        name: { firstName: 'Vera', lastName: 'Volunteer' },
      });
      expect(person?.createdDate).toBeInstanceOf(Date);
      expect(person?.serialize()).toMatchObject({ email: 'volunteer@example.com' });
    });

    test('keeps only a salted hash of the password, outside the users collection', async () => {
      await signUp();

      const person = await collection('users').findOne({ email: 'volunteer@example.com' });
      expect(JSON.stringify(person)).not.toContain(credentials.password);
      const account = await collection('authV2Accounts').findOne({
        userId: { $in: [person?._id, person?._id.toString()] },
      });
      expect(account?.password).toEqual(expect.any(String));
      expect(account?.password).not.toContain(credentials.password);
    });

    test('rejects duplicate emails and usernames, bad emails, weak passwords and bad usernames', async () => {
      expect((await signUp()).status).toBe(200);

      const rejections = [
        [await signUp({ username: 'other' }), 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'],
        [await signUp({ email: 'new@example.com' }), 'USERNAME_IS_ALREADY_TAKEN'],
        [await signUp({ email: 'nope', username: 'two' }), 'VALIDATION_ERROR'],
        [
          await signUp({ email: 'a@example.com', username: 'three', password: 'short' }),
          'PASSWORD_TOO_SHORT',
        ],
        [await signUp({ email: 'b@example.com', username: 'ab' }), 'USERNAME_TOO_SHORT'],
        [await signUp({ email: 'c@example.com', username: 'has space' }), 'INVALID_USERNAME'],
      ] as const;
      for (const [res, code] of rejections) {
        expect(res.status, code).toBeGreaterThanOrEqual(400);
        expect(res.status, code).toBeLessThan(500);
        expect(res.body.code).toBe(code);
      }
      expect(await User.countDocuments()).toBe(1);
    });

    test('refuses an email that already belongs to a current volunteer', async () => {
      await User.create({ email: 'legacy@example.com', name: { firstName: 'Lee' } });

      const res = await signUp({ email: 'legacy@example.com', username: 'lee' });

      expect(res.status).toBe(422);
      const legacy = await collection('users').findOne({ email: 'legacy@example.com' });
      expect(legacy?.username).toBeUndefined();
      expect(await collection('authV2Accounts').countDocuments()).toBe(0);
    });
  });

  describe('sign-in', () => {
    beforeEach(async () => {
      await signUp();
    });

    test('works with the email, in any letter case', async () => {
      const res = await post('/sign-in/email', {
        email: 'VOLUNTEER@example.com',
        password: credentials.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('volunteer@example.com');
    });

    test('works with the username', async () => {
      const res = await post('/sign-in/username', {
        username: 'VOLUNTEER',
        password: credentials.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('volunteer@example.com');
    });

    test('gives the same answer for a wrong password and an unknown account', async () => {
      const wrongPassword = await post('/sign-in/email', {
        email: 'volunteer@example.com',
        password: 'definitely not it',
      });
      const unknownUser = await post('/sign-in/email', {
        email: 'nobody@example.com',
        password: 'definitely not it',
      });

      expect(wrongPassword.status).toBe(401);
      expect(unknownUser.status).toBe(401);
      expect(wrongPassword.body).toEqual(unknownUser.body);
      expect(wrongPassword.headers['set-cookie']).toBeUndefined();
    });

    test('does not let a current volunteer without a password sign in', async () => {
      await User.create({ email: 'legacy@example.com', name: { firstName: 'Lee' } });
      const res = await post('/sign-in/email', {
        email: 'legacy@example.com',
        password: credentials.password,
      });
      expect(res.status).toBe(401);
    });

    test('refuses a deactivated volunteer', async () => {
      await User.updateOne({ email: 'volunteer@example.com' }, { isActive: false });

      const res = await post('/sign-in/email', {
        email: 'volunteer@example.com',
        password: credentials.password,
      });

      expect(res.status).toBe(403);
      expect(res.headers['set-cookie']).toBeUndefined();
      expect(await collection('authV2Sessions').countDocuments()).toBe(1); // only the sign-up one
    });

    test('refuses a request from another site that carries the session cookie', async () => {
      const cookie = cookiePair(await signUp({ email: 'other@example.com', username: 'other' }));

      const res = await request
        .post('/api/auth/v2/sign-out')
        .set('Origin', 'https://evil.example')
        .set('Cookie', cookie)
        .send({});

      expect(res.status).toBe(403);
      expect((await getSession(cookie)).body.user.email).toBe('other@example.com'); // still signed in
    });
  });

  describe('session', () => {
    test('is an httpOnly, SameSite cookie that only the v2 routes receive', async () => {
      const cookie = cookieFrom(await signUp());

      expect(cookie).toMatch(/HttpOnly/i);
      expect(cookie).toMatch(/SameSite=Lax/i);
      expect(cookie).toMatch(/Path=\/api\/auth\/v2(;|$)/);
      expect(cookie).not.toMatch(/Secure/i); // the test base URL is plain http
    });

    test('is Secure when the site is served over https', async () => {
      process.env.AUTH_V2_BASE_URL = 'https://vrms.example';
      resetAuthV2();
      const res = await request
        .post('/api/auth/v2/sign-up/email')
        .set('Origin', 'https://vrms.example')
        .send(credentials);

      expect(cookieFrom(res)).toMatch(/Secure/i);
    });

    test('tells the page who is signed in, and nobody when there is no session', async () => {
      const cookie = cookiePair(await signUp());

      const signedIn = await getSession(cookie);
      expect(signedIn.body.user).toMatchObject({ email: 'volunteer@example.com' });

      const signedOut = await getSession();
      expect(signedOut.status).toBe(200);
      expect(signedOut.body).toBeNull();
    });

    test('a forged or tampered cookie is not a session', async () => {
      const cookie = cookiePair(await signUp());
      expect((await getSession(`${cookie}x`)).body).toBeNull();
      expect((await getSession('vrms-v2.session_token=made-up.value')).body).toBeNull();
    });

    test('sign-out deletes the session and the old cookie stops working', async () => {
      const cookie = cookiePair(await signUp());
      expect(await collection('authV2Sessions').countDocuments()).toBe(1);

      const res = await post('/sign-out').set('Cookie', cookie);

      expect(res.status).toBe(200);
      expect(await collection('authV2Sessions').countDocuments()).toBe(0);
      expect((await getSession(cookie)).body).toBeNull();
    });

    test('signing out one browser leaves another signed in', async () => {
      await signUp();
      const first = cookiePair(
        await post('/sign-in/email', {
          email: 'volunteer@example.com',
          password: credentials.password,
        }),
      );
      const second = cookiePair(
        await post('/sign-in/email', {
          email: 'volunteer@example.com',
          password: credentials.password,
        }),
      );

      await post('/sign-out').set('Cookie', first);

      expect((await getSession(first)).body).toBeNull();
      expect((await getSession(second)).body.user.email).toBe('volunteer@example.com');
    });

    test('an expired session is not accepted', async () => {
      const cookie = cookiePair(await signUp());
      await collection('authV2Sessions').updateMany(
        {},
        { $set: { expiresAt: new Date(Date.now() - 1000) } },
      );

      expect((await getSession(cookie)).body).toBeNull();
    });
  });
});
