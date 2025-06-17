const EmailController = require('./email.controller');

test('Can import the email controller', async () => {
  expect(EmailController).not.toBeUndefined();
});
