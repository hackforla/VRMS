const { Event } = require('./event.model');

const { setupDB } = require("../setup-test");
setupDB("event-model");

describe("Event Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      name: "eventName",
      location: {
        // should we include address here?
        city: "Los Angeles",
        state: "California",
        country: "USA",
      },
      hacknight: "Online", // DTLA, Westside, South LA, Online
      eventType: "Workshop", // Project Meeting, Orientation, Workshop
      description: "A workshop to do stuff",
      date: 1594023390039,
      startTime: 1594023390039, // start date and time of the event
      endTime: 1594023390039, // end date and time of the event
      hours: 2, // length of the event in hours
      createdDate: 1594023390039, // date/time event was created
      updatedDate: 1594023390039, // date/time event was last updated
      checkInReady: false, // is the event open for check-ins?
      owner: {
        ownerId: 33, // id of user who created event
      },
    };

    await Event.create(submittedData);
    const savedDataArray = await Event.find();
    const savedData = savedDataArray[0];
    expect(savedData.name === submittedData.name);
    expect(savedData.location.city === submittedData.location.city);
    expect(savedData.startTime === submittedData.startTime);
    done();
  });
});
