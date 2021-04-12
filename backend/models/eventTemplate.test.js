const EventTemplate = require('./eventTemplate.model');
const { Location } = require('./dictionaries/location.model');
const { TimeZone } = require('./dictionaries/timeZone.model');
const { setupDB } = require('../setup-test');
setupDB('eventTemplate-model');

describe('Event Template Model saves the correct values', () => {
  test('Save a model instance and then read from the db', async (done) => {
    const testLocations = {
      locations: ['location1', 'location2'],
    };
    const testTimes = {
      timeZones: ['est', 'pst'],
    };

    await Location.create(testLocations);
    await Location.find({});

    await TimeZone.create(testTimes);
    await TimeZone.find({});

    const submittedData = {
      name: 'eventTemplateName',
      belongsToProjectID: "5e1a0651741b255ddda996c4",
      eventManagerID: "5e1a0651741b255ddda996c4",
      locationZone: 'location1',
      locationName: 'locationRed',
      description: 'A workshop to do stuff',
      type: 'Orientation',
      createdDate: 1594023390039,
      weekDay: 1,
      startTime: 1594023390039,
      endTime: 1594023390039,
      timeZone: 'est',
      templateID: 1594023390039,
      recurInterval: 'daily',
      monthWeek: 4,
      isActive: true,
      isOnline: true,
      location: {
        addressLine1: 'addy 1',
        addressLine2: 'addy 2',
        city: 'Los Angeles',
        state: 'California',
        zip: '93309',
      },
      videoConferenceLink: 'aLink',
    };

    await EventTemplate.create(submittedData);
    const savedDataArray = await EventTemplate.find();
    const savedData = savedDataArray[0];

    expect(savedData.name).toBe(submittedData.name);
    expect(savedData.location.city).toBe(submittedData.location.city);
    expect(savedData.startTime.getTime()).toBe(submittedData.startTime);
    console.log(savedData.belongsToProjectID);
    expect(savedData.belongsToProjectID.toString()).toBe(submittedData.belongsToProjectID);
    expect(savedData.eventManagerID.toString()).toBe(submittedData.eventManagerID);
    expect(savedData.timeZone).toBe(submittedData.timeZone);

    done();
  });
});
