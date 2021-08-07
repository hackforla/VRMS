const EmailController = require('./email.controller');

const { setupDB } = require('../setup-test');
setupDB('conrtoller-email');

test('Can import the email controller', async () => {
  expect(EmailController).not.toBeUndefined();
});
