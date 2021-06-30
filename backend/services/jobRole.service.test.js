const { JobRole } = require('../models/dictionaries/jobRole.model');
const { setupDB } = require("../setup-test");
const jobRoleService = require('./jobRole.service');

setupDB("jobRole-service");

describe("JobRoleService can retrieve roles", () => {
  test("fetch all roles", async (done) => {
    const testRoles = ["this", "is", "a", "test"];
    await JobRole.create({ roles: testRoles});

    const roles = await jobRoleService.getAll();

    expect(roles.length).toEqual(testRoles.length);
    expect([...roles]).toEqual(testRoles);

    done();
  });
  test("throws expected error", async (done) => {
    expect.assertions(1);
    try {
      await jobRoleService.getAll();
    } catch (e) {
      expect(e.name).toEqual("DatabaseError");
    }

    done();
  });
});
