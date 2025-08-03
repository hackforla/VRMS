const EventController = require('./event.controller');

test('Can import the email controller', async () => {
  expect(EventController).not.toBeUndefined();
});
