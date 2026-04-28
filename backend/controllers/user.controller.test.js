import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import { setupDB } from '../setup-test.js';
setupDB('conrtoller-user');

vi.mock('../models/user.model');
import userContoller from './user.controller.js';

test('Can import the email controller', async () => {
  expect(userContoller).not.toBeUndefined();
});
