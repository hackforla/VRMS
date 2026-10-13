import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';

test.skip('Environment variables are working as expected', () => {
  const backendUrl = process.env.REACT_APP_PROXY;
  expect(backendUrl).toBe(`http://localhost:${process.env.BACKEND_PORT}`);
});
