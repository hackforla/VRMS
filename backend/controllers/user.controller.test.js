import userContoller from './user.controller.js';

test('Can import the email controller', async () => {
  expect(userContoller).not.toBeUndefined();
});
