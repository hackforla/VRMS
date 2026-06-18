import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import userContoller from './user.controller.js';

test('Can import the email controller', async () => {
  expect(userContoller).not.toBeUndefined();
});
