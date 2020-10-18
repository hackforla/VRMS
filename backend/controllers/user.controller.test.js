jest.mock('../models/user.model');
const { setupDB } = require('../setup-test');
setupDB('conrtoller-user');
const userContoller = require('./user.controller');

test('Can import the email controller', async () => {
  expect(userContoller).not.toBeUndefined();
});
