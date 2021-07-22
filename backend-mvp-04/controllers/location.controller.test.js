const LocationController = require('./location.controller');
const { setupDB } = require('../setup-test');

setupDB('router-location');

test('controller should exist', async () => {
    expect(LocationController).not.toBeUndefined();
});
