import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockGetAllFlags = vi.hoisted(() => vi.fn());

vi.mock('posthog-node', () => {
  class MockPostHog {
    constructor() {
      this.getAllFlags = mockGetAllFlags;
    }
  }
  return { PostHog: MockPostHog };
});

import { getAllFlags } from './featureFlags.service.js';

describe('featureFlags.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls PostHog client getAllFlags with the provided distinctId', async () => {
    mockGetAllFlags.mockResolvedValue({ flag1: true });

    await getAllFlags('user-123');

    expect(mockGetAllFlags).toHaveBeenCalledWith('user-123');
  });

  test('returns the flags object from PostHog', async () => {
    const expectedFlags = { 'feature-a': true, 'feature-b': false };
    mockGetAllFlags.mockResolvedValue(expectedFlags);

    const result = await getAllFlags('user-123');

    expect(result).toEqual(expectedFlags);
  });

  test('propagates errors from PostHog client', async () => {
    mockGetAllFlags.mockRejectedValue(new Error('PostHog API error'));

    await expect(getAllFlags('user-123')).rejects.toThrow('PostHog API error');
  });

});
