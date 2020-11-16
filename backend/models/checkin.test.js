const { CheckIn } = require('./checkIn.model');

const { setupDB } = require("../setup-test");
setupDB("checkin-model");

describe("Checkin Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedCheckinData = {
      userId: "1",
      eventId: "23",
      checkedIn: true,
      createdDate: 1594023390039,
    };

    await CheckIn.create(submittedCheckinData);
    const savedCheckinDataArray = await CheckIn.find();
    const savedCheckinData = savedCheckinDataArray[0];
    expect(savedCheckinData.userId).toBe(submittedCheckinData.userId);
    expect(savedCheckinData.eventId).toBe(submittedCheckinData.eventId);
    expect(savedCheckinData.createdDate.getTime()).toBe(submittedCheckinData.createdDate);
    done();
  });
});
