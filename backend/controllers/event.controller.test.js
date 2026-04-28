import EventController from './event.controller.js';

test('Can import the email controller', async () => {
  expect(EventController).not.toBeUndefined();
});
