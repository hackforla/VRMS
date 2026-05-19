import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock Auth.addCookieIfAvailable middleware
const mockAddCookieIfAvailable = vi.hoisted(() => vi.fn((req, res, next) => next()));
vi.mock('../middleware/auth.middleware.js', () => ({
  default: {
    addCookieIfAvailable: mockAddCookieIfAvailable,
  },
}));

// Mock FeatureFlagsController
const mockIndex = vi.hoisted(() => vi.fn());
vi.mock('../controllers/index.js', () => ({
  FeatureFlagsController: {
    index: mockIndex,
  },
}));

import featureFlagsRouter from './featureFlags.router.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use(express.json());
testapp.use('/api/featureflags', featureFlagsRouter);
const request = supertest(testapp);

describe('FeatureFlags router', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('GET / calls addCookieIfAvailable middleware then controller', async () => {
    mockIndex.mockImplementation((req, res) => {
      res.status(200).json({ flag: true });
    });

    await request.get('/api/featureflags');

    expect(mockAddCookieIfAvailable).toHaveBeenCalled();
    expect(mockIndex).toHaveBeenCalled();
  });

  it('returns 200 with flags when controller succeeds', async () => {
    const flags = { 'new-feature': true, 'old-feature': false };
    mockIndex.mockImplementation((req, res) => {
      res.status(200).json(flags);
    });

    const response = await request.get('/api/featureflags');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(flags);
  });

  it('returns 403 when controller rejects header', async () => {
    mockIndex.mockImplementation((req, res) => {
      res.sendStatus(403);
    });

    const response = await request.get('/api/featureflags');

    expect(response.status).toBe(403);
  });
});
