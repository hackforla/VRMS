const { RecurringEvent } = require('./recurringEvent.model');

const { setupDB } = require("../setup-test");
setupDB("recurringEvent-model");

// Please add and expand on this simple test.
describe("Question Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      name: "testRecurringEvent",
      location: {
        // should we include address here?
        city: "Los Angeles",
        state: "California",
        country: "USA",
      },
      hacknight: "Online", // DTLA, Westside, South LA, Online
      brigade: "Hack for LA",
      eventType: "Workshop", // Project Meeting, Orientation, Workshop
      description: "A test instance",
      date: 1594023390039,
      startTime: 1594023390039, // start date and time of the event
      endTime: 1594023390039, // end date and time of the event
      hours: 1594023390039, // length of the event in hours
      createdDate: 1594023390039, // date/time event was created
      updatedDate: 1594023390039, // date/time event was last updated
      checkInReady: true, // is the event open for check-ins?
    };

    await RecurringEvent.create(submittedData);
    const savedDataArray = await RecurringEvent.find();
    const savedData = savedDataArray[0];
    expect(savedData.name === submittedData.name);
    expect(savedData.location.country === submittedData.location.country);
    expect(savedData.description === submittedData.description);
    done();
  });
});
