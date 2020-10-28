const EventTemplate = require("./eventTemplate.model");

const { setupDB } = require("../setup-test");
setupDB("eventTemplate-model");

describe("Event Template Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      name: "eventTemplateName",
      description: "A workshop to do stuff",
      type: "Orientation",
      createdDate: 1594023390039,
      weekDay: 1,
      startTime: 1594023390039, 
      endTime: 1594023390039,
      isActive: true,
      isOnline: true,
      location: {
        // should we include address here?
        addressLine1: "addy 1",
        addressLine2: "addy 2",
        city: "Los Angeles",
        state: "California",
        zip: "93309",
      },
      videoConferenceLink: "aLink"
    };

    await EventTemplate.create(submittedData);
    const savedDataArray = await EventTemplate.find();
    const savedData = savedDataArray[0];
    expect(savedData.name === submittedData.name);
    expect(savedData.location.city === submittedData.location.city);
    expect(savedData.startTime === submittedData.startTime);
    done();
  });
});
