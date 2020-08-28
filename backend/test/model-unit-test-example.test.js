// Unit Test Example - This is for instructional purposes on writing a backend unit test.

const mongoose = require("mongoose");
const dbHandler = require("./db-handler");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

// Test data
const Checkin = require("../models/checkIn.model.js");
const answerData = {
  userId: "1",
  eventId: "23",
  checkedIn: true,
  createdDate: 1594023390039,
};

describe("Verify that our unit tests have a working database", () => {
  test("Save a model instance and then read from the db", async (done) => {
    await Checkin.create(answerData);
    const savedCheckinTime = await Checkin.find();
    expect(savedCheckinTime[0].checkedIn === answerData.checkedIn);
    done();
  });

  test("Data added from a previous test persists in the db", async (done) => {
    const test = await Checkin.find();
    done();
  });

  it("Test writers can create a model within the tests", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const count = await User.countDocuments();
    expect(count).toEqual(0);

    const userFromDatabase = await User.find();
    expect(userFromDatabase.length === 1);
  });
});
