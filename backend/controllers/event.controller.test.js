import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import { setupDB } from '../setup-test.js';
setupDB('event-controller');

import EventController from './event.controller.js';

test('Can import the email controller', async () => {
  expect(EventController).not.toBeUndefined();
});
