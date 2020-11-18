const userProfileService = require('./userProfile.service');
const modificationLogService = require('./modificationLog.service');

const { setupDB } = require("../setup-test");

setupDB("userProfile-service");

describe("UserProfileService can save/update/get user profiles", () => {
  test("Save a user profile record and then retrieve it by the service", async (done) => {


    const newRecord = {signupEmail: "foo@bar.com" };

    const result = await userProfileService.createUser(newRecord);

    expect(result.isNew).toBe(false);

    // verify log record was created
    const logResult = await modificationLogService.getLogs(result._id, "UserProfile");

    expect(logResult.length).toBe(1);

    const findUserResult = await userProfileService.getUser(result._id);
    expect(findUserResult.signupEmail).toBe(result.signupEmail);

    const findUserByEmailResult = await userProfileService.getUserByEmail(result.signupEmail);
    expect(findUserByEmailResult.signupEmail).toBe(result.signupEmail);

    done();
  });

  test("Try and create a user profile with no email. Should throw an exeception", async (done) => {

    const newRecordNoEmailDefined = {};
    const newRecordEmailNull= {signupEmail: null};
    const newRecordNoEmail = {signupEmail: "" };
   
    await expect(userProfileService.createUser(newRecordNoEmailDefined)).rejects.toThrow()
    await expect(userProfileService.createUser(newRecordEmailNull)).rejects.toThrow()
    await expect(userProfileService.createUser(newRecordNoEmail)).rejects.toThrow()

    done();
  });

  test("Try and update a user profile", async (done) => {

    const newRecord = {signupEmail: "foo@bar.com" };
    const newRecordResult = await userProfileService.createUser(newRecord);

    expect(newRecordResult.firstName).toBeUndefined();
    expect(newRecordResult.lastName).toBeUndefined();
    expect(newRecordResult.meetLocation).toBeUndefined();

    const updateRecordData = {firstName: "Foo", lastName: "Bar", meetLocation: "Los Angeles"};
    const updatedRecordResult = await userProfileService.updateUser(newRecordResult.signupEmail
      , updateRecordData);

    expect(updatedRecordResult.firstName).toBe(updateRecordData.firstName);
    expect(updatedRecordResult.lastName).toBe(updateRecordData.lastName);
    expect(updatedRecordResult.meetLocation).toBe(updateRecordData.meetLocation);


    const updateRecordNoMeetLocationData = {meetLocation: null};
    const updatedRecordNoMeetLocationResult = await userProfileService
      .updateUser(newRecordResult.signupEmail, updateRecordNoMeetLocationData);


    expect(updatedRecordNoMeetLocationResult.meetLocation).toBeNull();

    // Try and change email address, which is ignored
    const notAllowedUpdate = {signupEmail: "changed@email.com"};
    const notAllowedResult = await userProfileService.updateUser(newRecordResult.signupEmail
      , notAllowedUpdate);

    expect(notAllowedResult.signupEmail).toBe(newRecordResult.signupEmail);

    done();
  });
});
