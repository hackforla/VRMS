import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import EventController from './event.controller.js';

test('Can import the email controller', async () => {
  expect(EventController).not.toBeUndefined();
});
