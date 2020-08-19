// tests/product.test.js

const mongoose = require("mongoose");

const dbHandler = require("./db-handler");
const Checkin = require("../models/checkIn.model");
const answerData = {
  userId: "1",
  eventId: "23",
  checkedIn: true,
  createdDate: 1594023390039,
};
// async function checkinUser() {
//   const checkin = await Checkin.create(answerData);
// }

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Product test suite.
 */
describe("Checkin ", () => {
  /**
   * Tests that a valid product can be created through the productService without throwing any errors.
   */
  it("can be created correctly", async () => {
    expect(async () => {
      const newCheckin = await Checkin.create(answerData);
      expect(newCheckin.userId).toBe("1");
    });
  });

  it("...", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const count = await User.countDocuments();
    expect(count).toEqual(0);
  });
});

/**
 * Complete product example.
 */
// const productComplete = {
//   name: "iPhone 11",
//   price: 699,
//   description:
//     "A new dual‑camera system captures more of what you see and love. ",
// };
