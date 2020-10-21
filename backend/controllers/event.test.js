const { setupDB } = require('../setup-test');
setupDB('event-controller');

const EventController = require('./event');

test('Can import the email controller', async () => {
  expect(EventController).not.toBeUndefined();
});
