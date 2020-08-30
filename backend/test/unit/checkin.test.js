const Checkin = require("../../models/answer.model");
const dbHandler = require("../db-handler");

// Required database setup and teardown
beforeAll(async () => await dbHandler.connect());
afterAll(async () => await dbHandler.closeDatabase());

describe("Checkin Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedCheckinData = {
      userId: "1",
      eventId: "23",
      checkedIn: true,
      createdDate: 1594023390039,
    };

    await Checkin.create(submittedCheckinData);
    const savedCheckinDataArray = await Checkin.find();
    const savedCheckinData = savedCheckinDataArray[0];
    expect(savedCheckinData.userId === submittedCheckinData.userId);
    expect(savedCheckinData.eventId === submittedCheckinData.eventId);
    expect(savedCheckinData.createdDate === submittedCheckinData.createdDate);
    done();
  });
});
