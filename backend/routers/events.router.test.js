const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

const { setupDB } = require("../setup-test");
setupDB("api-events");

const db = require("../models");
const Event = db.event;

// API Tests
describe("Test add data with POST and then retrieve the data with GET", () => {
  test("POST and then GET", async (done) => {
    // Test Data
    const submittedData = {
      createdDate: "2020-05-20T21:16:44.498Z",
      checkinReady: true,
    };

    // Add an event with a project using the API.
    const res = await request.post("/api/events").send(submittedData);

    // Retrieve and compare the the Event values using the DB.
    const databaseEventQuery = await Event.find();
    const databaseEvent = databaseEventQuery[0];
    expect(databaseEvent.length >= 1);
    expect(databaseEvent.createdDate === submittedData.createdDate);

    // Retrieve and compare the the values using the API.
    const response = await request.get("/api/events");
    expect(response.statusCode).toBe(200);
    const APIData = response.body[0];
    expect(APIData.createdDate === submittedData.createdDate);
    done();
  });
});
