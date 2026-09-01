import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import EmailController from './email.controller.js';

test('Can import the email controller', async () => {
  expect(EmailController).not.toBeUndefined();
});
