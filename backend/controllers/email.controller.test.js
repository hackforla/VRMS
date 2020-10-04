const emailController = require('./email.controller');

test('Can import the email controller', async () => {
  console.log(emailController);
  expect(emailController).not.toBeUndefined();
});
