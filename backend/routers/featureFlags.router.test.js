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

});
