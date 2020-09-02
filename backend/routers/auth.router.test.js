const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

const { setupDB } = require("../setup-test");
setupDB("api-auth");

// const authRouter = require("./auth.router");

const CONFIG = require("../config/auth.config");

const db = require("../models");
const User = db.user;

// API Tests
describe("Test that we can create a user using Auth", () => {
  test("Submit a user and retrieve that user", async () => {
    // Test Data
    const submittedData = {
      name: { firstName: "test_first", lastName: "test_last" },
      email: "test@test.com",
    };
    let headers = {};
    headers["x-customrequired-header"] = CONFIG.custom_request_header;

    // Add an event with a project using the API.
    const res = await request
      .post("/api/users")
      .send(submittedData)
      .set(headers);

    expect(res.status).toBe(201);

    // Retrieve and compare the the Event values using the DB.
    const databaseEventQuery = await User.find();
    const databaseEvent = databaseEventQuery[0];
    expect(databaseEvent.length >= 1);
    expect(databaseEvent.name === submittedData.name);

    // Retrieve and compare the the values using the API.
    const response = await request.get("/api/users").set(headers);
    expect(response.statusCode).toBe(200);
    const APIData = response.body[0];
    expect(APIData.name === submittedData.name);
  });
});
