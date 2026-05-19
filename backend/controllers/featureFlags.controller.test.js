import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/featureFlags.service.js');

import FeatureFlagsController from './featureFlags.controller.js';
import { getAllFlags } from '../services/featureFlags.service.js';

describe('FeatureFlagsController.index', () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
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
    const mockFlags = { flag1: true, flag2: false };
    getAllFlags.mockResolvedValue(mockFlags);

    await FeatureFlagsController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockFlags);
  });

  test('should return 400 when getAllFlags throws an error', async () => {
    getAllFlags.mockRejectedValue(new Error('error'));

    await FeatureFlagsController.index(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  test('should return 403 when x-customrequired-header is missing', async () => {
    req.headers = {};

    await FeatureFlagsController.index(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('should return 403 when x-customrequired-header has wrong value', async () => {
    req.headers['x-customrequired-header'] = 'wrong-value';

    await FeatureFlagsController.index(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('should use req.userId as distinctId when available', async () => {
    getAllFlags.mockResolvedValue({});
    req.userId = 'user-42';

    await FeatureFlagsController.index(req, res);

    expect(getAllFlags).toHaveBeenCalledWith('user-42');
  });

  test('should fall back to anonymous when req.userId is undefined', async () => {
    getAllFlags.mockResolvedValue({});
    req.userId = undefined;

    await FeatureFlagsController.index(req, res);

    expect(getAllFlags).toHaveBeenCalledWith('anonymous');
  });

  test('should fall back to anonymous when req.userId is null', async () => {
    getAllFlags.mockResolvedValue({});
    req.userId = null;

    await FeatureFlagsController.index(req, res);

    expect(getAllFlags).toHaveBeenCalledWith('anonymous');
  });

  test('should not call getAllFlags when header validation fails', async () => {
    req.headers = {};

    await FeatureFlagsController.index(req, res);

    expect(getAllFlags).not.toHaveBeenCalled();
  });

  test('should call res.json with the actual flags object', async () => {
    const flags = { 'new-dashboard': true, 'beta-feature': false, 'experiment-x': true };
    getAllFlags.mockResolvedValue(flags);

    await FeatureFlagsController.index(req, res);

    expect(res.json).toHaveBeenCalledWith(flags);
  });
});
