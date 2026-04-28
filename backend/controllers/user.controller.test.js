import { setupDB } from '../setup-test.js';
setupDB('conrtoller-user');

jest.mock('../models/user.model');
import userContoller from './user.controller.js';

test('Can import the email controller', async () => {
  expect(userContoller).not.toBeUndefined();
});
