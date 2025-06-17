const userContoller = require('./user.controller');

test('Can import the email controller', async () => {
  expect(userContoller).not.toBeUndefined();
});
