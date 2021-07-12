const timeZoneService = require('./timeZone.service');
const { TimeZone } = require('../models/dictionaries/timeZone.model');
const { setupDB } = require("../setup-test");

setupDB("timeZone-service");

describe("TimeZoneService can retrieve Timezones", () => {
  test("Save a log record and then retrieve it by the service", async (done) => {

    const submittedData = {
      timeZones: ["zone1","zone2"]
    };

    await TimeZone.create(submittedData);

    const retrievedTimeZones = await timeZoneService.getTimeZones();

    expect(retrievedTimeZones.length).toEqual(submittedData.timeZones.length);

    const retreivedZone1 = retrievedTimeZones[0];

    expect(retreivedZone1).toEqual(submittedData.timeZones[0]);
    
    const retreivedZone2 = retrievedTimeZones[1];

    expect(retreivedZone2).toEqual(submittedData.timeZones[1]);
  
    done();
  });
});
