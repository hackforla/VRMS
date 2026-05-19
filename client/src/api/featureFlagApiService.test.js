import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchFeatureFlags } from './featureFlagApiService';

describe('featureFlagApiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  test('calls fetch with correct URL', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    await fetchFeatureFlags();

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/featureflags',
      expect.any(Object),
    );
  });

  test('calls fetch with correct headers including x-customrequired-header', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    await fetchFeatureFlags();

    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].headers).toEqual(
      expect.objectContaining({
        'x-customrequired-header': expect.any(String),
      }),
    );
  });

  test('calls fetch with credentials include', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    await fetchFeatureFlags();

    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].credentials).toBe('include');
  });

  test('calls fetch with GET method', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    await fetchFeatureFlags();

    const callArgs = global.fetch.mock.calls[0];
    expect(callArgs[1].method).toBe('GET');
  });

  test('returns parsed JSON response', async () => {
    const mockFlags = { 'feature-x': true };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockFlags),
    });

    const result = await fetchFeatureFlags();

    expect(result).toEqual(mockFlags);
  });
});
