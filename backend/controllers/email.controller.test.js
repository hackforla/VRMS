import EmailController from './email.controller.js';

import { setupDB } from '../setup-test.js';
setupDB('conrtoller-email');

test('Can import the email controller', async () => {
  expect(EmailController).not.toBeUndefined();
});
