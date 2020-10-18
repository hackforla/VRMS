const { setupDB } = require('../setup-test');
setupDB('conrtoller-email');
const emailController = require('./email.controller');

test('Can import the email controller', async () => {
  expect(emailController).not.toBeUndefined();
});
