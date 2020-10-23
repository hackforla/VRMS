const { setupDB } = require('../setup-test');
setupDB('conrtoller-email');
const EmailController = require('./email.controller');

test('Can import the email controller', async () => {
  expect(EmailController).not.toBeUndefined();
});
