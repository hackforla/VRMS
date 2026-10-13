import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { FeatureFlagProvider, useFeatureFlags } from './featureFlagsContext';

vi.mock('../api/featureFlagApiService', () => ({
  fetchFeatureFlags: vi.fn(),
}));

import { fetchFeatureFlags } from '../api/featureFlagApiService';

// Test component that consumes the context
function TestConsumer() {
  const { flags, loading } = useFeatureFlags();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="flags">{JSON.stringify(flags)}</span>
    </div>
  );
}

describe('FeatureFlagProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders children', async () => {
    fetchFeatureFlags.mockResolvedValue({});

    render(
      <FeatureFlagProvider>
        <span data-testid="child">hello</span>
      </FeatureFlagProvider>,
    );

    expect(screen.getByTestId('child')).toBeTruthy();
  });

  test('fetches flags on mount and provides them via context', async () => {
    const mockFlags = { 'beta': true, 'dark-mode': false };
    fetchFeatureFlags.mockResolvedValue(mockFlags);

    render(
      <FeatureFlagProvider>
        <TestConsumer />
      </FeatureFlagProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('flags').textContent).toBe(JSON.stringify(mockFlags));
    expect(fetchFeatureFlags).toHaveBeenCalledTimes(1);
  });

  test('handles fetch errors gracefully', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchFeatureFlags.mockRejectedValue(new Error('Network error'));

    render(
      <FeatureFlagProvider>
        <TestConsumer />
      </FeatureFlagProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // flags should remain empty object on error
    expect(screen.getByTestId('flags').textContent).toBe('{}');
  });

  test('starts with loading true', () => {
    fetchFeatureFlags.mockReturnValue(new Promise(() => {})); // never resolves

    render(
      <FeatureFlagProvider>
        <TestConsumer />
      </FeatureFlagProvider>,
    );

    expect(screen.getByTestId('loading').textContent).toBe('true');
  });
});

describe('useFeatureFlags', () => {
  test('throws when used outside provider', () => {
    // Suppress React error boundary output
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useFeatureFlags must be used within FeatureFlagProvider',
    );
  });
});
