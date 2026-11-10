import cookieParser from 'cookie-parser';
import express from 'express';
import supertest from 'supertest';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import UserController from '../controllers/user.controller.js';
import { User } from '../models/user.model.js';
import { hashPassword } from '../services/authV2.service.ts';
import { setupIntegrationDB } from '../setup-test.js';
import authV2Router from './auth-v2.router.ts';

const HEADER = vi.hoisted(() => {
  process.env.CUSTOM_REQUEST_HEADER ??= 'test-custom-header';
  return process.env.CUSTOM_REQUEST_HEADER;
});

setupIntegrationDB('api-users-credentials');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/api/users', UserController.create);
app.post('/api/users/bulk-updates', UserController.bulkUpdateManagedProjects);
app.patch('/api/users/:UserId', UserController.update);
app.use('/api/auth/v2', authV2Router);
const request = supertest(app);

const header = () => ({ 'x-customrequired-header': HEADER });
const password = 'attacker chosen password';
let passwordHash: string;

const signIn = (identifier: string) =>
  request.post('/api/auth/v2/signin').send({ identifier, password });

const storedCredentials = async (email: string) =>
  User.findOne({ email }).select('+passwordHash').lean();

beforeAll(async () => {
  process.env.AUTH_V2_ACCESS_TOKEN_SECRET = 'test-secret-that-is-at-least-32-characters-long';
  process.env.AUTH_V2_SIGNIN_LIMIT = '10000';
  process.env.AUTH_V2_BCRYPT_ROUNDS = '4';
  passwordHash = await hashPassword(password);
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('v1 user endpoints cannot set Login v2 credentials', () => {
  test('POST /api/users drops passwordHash and username', async () => {
    const res = await request
      .post('/api/users')
      .set(header())
      .send({ email: 'new@example.com', name: { firstName: 'N', lastName: 'U' }, passwordHash, username: 'newbie' });
    expect(res.status).toBe(201);

    const stored = await storedCredentials('new@example.com');
    expect(stored?.passwordHash).toBeUndefined();
    expect(stored?.username).toBeUndefined();
    expect((await signIn('new@example.com')).status).toBe(401);
    expect((await signIn('newbie')).status).toBe(401);
  });

  test('PATCH /api/users/:id drops passwordHash and username, including inside update operators', async () => {
    const user = await User.create({ email: 'admin@example.com', bio: 'passwordHash-to-be' });
    for (const body of [
      { passwordHash, username: 'admin1', isActive: false },
      { $set: { passwordHash, username: 'admin1' } },
      { $set: { bio: passwordHash }, $rename: { bio: 'passwordHash' } },
    ]) {
      const res = await request.patch(`/api/users/${user._id}`).set(header()).send(body);
      expect(res.status).toBe(200);
    }

    const stored = await storedCredentials('admin@example.com');
    expect(stored?.isActive).toBe(false);
    expect(stored?.passwordHash).toBeUndefined();
    expect(stored?.username).toBeUndefined();
    expect((await signIn('admin@example.com')).status).toBe(401);
  });

  test('POST /api/users/bulk-updates refuses anything but managedProjects changes', async () => {
    const user = await User.create({ email: 'admin@example.com' });
    for (const bulkOps of [
      [{ updateOne: { filter: { email: 'admin@example.com' }, update: { $set: { passwordHash } } } }],
      [{ updateOne: { filter: { _id: user._id }, update: { $addToSet: { managedProjects: '64b7f0f0f0f0f0f0f0f0f0f0' }, $set: { username: 'admin1' } } } }],
      [{ updateMany: { filter: {}, update: { $set: { passwordHash } } } }],
      [{ insertOne: { document: { email: 'evil@example.com', passwordHash } } }],
      [{ updateOne: { filter: { _id: user._id }, update: [{ $set: { passwordHash } }] } }],
    ]) {
      const res = await request.post('/api/users/bulk-updates').set(header()).send({ bulkOps });
      expect(res.status).toBe(400);
    }

    const stored = await storedCredentials('admin@example.com');
    expect(stored?.passwordHash).toBeUndefined();
    expect(stored?.username).toBeUndefined();
    expect(await User.countDocuments({ email: 'evil@example.com' })).toBe(0);
    expect((await signIn('admin@example.com')).status).toBe(401);
  });

  test('POST /api/users/bulk-updates still adds and removes managed projects', async () => {
    const user = await User.create({ email: 'pm@example.com' });
    const projectId = '64b7f0f0f0f0f0f0f0f0f0f0';
    const op = (operator: string) => [
      { updateOne: { filter: { _id: String(user._id) }, update: { [operator]: { managedProjects: projectId } } } },
    ];

    expect((await request.post('/api/users/bulk-updates').set(header()).send({ bulkOps: op('$addToSet') })).status).toBe(200);
    expect((await User.findById(user._id).lean())?.managedProjects).toEqual([projectId]);

    expect((await request.post('/api/users/bulk-updates').set(header()).send({ bulkOps: op('$pull') })).status).toBe(200);
    expect((await User.findById(user._id).lean())?.managedProjects).toEqual([]);
  });
});
