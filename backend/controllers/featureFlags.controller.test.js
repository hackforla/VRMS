import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/featureFlags.service.js');

import FeatureFlagsController from './featureFlags.controller.js';
import { getAllFlags } from '../services/featureFlags.service.js';

describe('FeatureFlagsController.index', () => {
  let req, res;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      headers: { 'x-customrequired-header': process.env.CUSTOM_REQUEST_HEADER },
      userId: 'user-1',
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      sendStatus: vi.fn(),
    };
  });

  test('can get feature flags', async () => {
    await FeatureFlagsController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should return 400 when getAllFlags throws an error', async () => {
    getAllFlags.mockRejectedValue(new Error('error'));

    await FeatureFlagsController.index(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });
});
