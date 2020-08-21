const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const dbHandler = require("./db-handler");

const Event = require("../models/event.model.js");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

// API Tests
describe("Test GET with no data in database", () => {
  test("GET events", async (done) => {
    const response = await request.get("/api/events");
    expect(response.statusCode).toBe(200);
    done();
  });
});

describe("Test add data with POST and then retrieve the data with GET", () => {
  test("POST and then GET", async (done) => {
    const res = await request.post("/api/events").send({
      createdDate: "2020-05-20T21:16:44.498Z",
      checkinReady: true,
    });
    const response = await request.get("/api/events");
    expect(response.statusCode).toBe(200);
    const event_json = response.body[0];
    expect(event_json.createdDate === "2020-05-20T21:16:44.498Z");

    done();
  });

  test("Data can be verified from a database query", async (done) => {
    const databaseEventQuery = await Event.find();
    expect(databaseEventQuery[0].length >= 1);
    done();
  });
});
