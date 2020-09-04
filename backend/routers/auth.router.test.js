const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

const { setupDB } = require("../setup-test");
setupDB("api-auth");

const CONFIG = require("../config/auth.config");

const db = require("../models");
const User = db.user;

// API Tests
describe("Test that we can create a user using /user routes", () => {
  test("POST a user and retrieve that user from /user", async () => {
    // Test Data
    const submittedData = {
      name: { firstName: "test_first", lastName: "test_last" },
      email: "test@test.com",
    };
    let headers = {};
    headers["x-customrequired-header"] = CONFIG.CUSTOM_REQUEST_HEADER;

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

describe("Test user can sign up through API", () => {
  test("A POST with invalid name data should return a 400 and error message.", async () => {
    // Test Data
    const badUserData = {
      firstName: "test_first",
      lastName: "test_last",
      email: "test@test.com",
    };
    const res = await request
      .post("/api/auth/signup")
      .send(badUserData)
      .set("Accept", "application/json");

    expect(res.status).toBe(422);
    const errorMessage = JSON.parse(res.text);

    expect(errorMessage.errors).toEqual([
      { msg: "Invalid value", param: "name.firstName", location: "body" },
      { msg: "Invalid value", param: "name.lastName", location: "body" },
    ]);
  });
  test("A POST valid data should return a 200 and success message.", async () => {
    // setupDBRoles();
    // Test Data
    const goodUserData = {
      name: { firstName: "testname", lastName: "testlast" },
      email: "test@test.com",
    };

    const goodUserDataJSON = JSON.stringify(goodUserData);
    const res = await request
      .post("/api/auth/signup")
      .send(goodUserData)
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).message).toEqual(
      "User was registered successfully!"
    );
  });
  test("A POST of an already used email returns a 400 and an error message.", async () => {
    // Test Data
    const userOneWithSameEmail = {
      name: { firstName: "one", lastName: "two" },
      email: "test@test.com",
    };

    const userTwoWithSameEmail = {
      name: { firstName: "three", lastName: "four" },
      email: "test@test.com",
    };

    const _ = await request
      .post("/api/auth/signup")
      .send(userOneWithSameEmail)
      .set("Accept", "application/json");

    const res2 = await request
      .post("/api/auth/signup")
      .send(userTwoWithSameEmail)
      .set("Accept", "application/json");

    expect(res2.status).toBe(400);
    expect(JSON.parse(res2.text).message).toEqual(
      "Failed! Email is already in use!"
    );
  });
});
