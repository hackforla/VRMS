const modificationLogService = require('./modificationLog.service');
const { setupDB } = require("../setup-test");

setupDB("modificationLog-service");

describe("ModificationLogService can save and retrieve logs", () => {
  test("Save a log record and then retrieve it by the service", async (done) => {

    const authorEmail = "foo@bar.com";
    const objectId = "1";
    const objectType = "UserProfile";
    const newState = {name: "Foo"};

    await modificationLogService.saveLog(authorEmail, objectId, objectType,
      newState );

    const noResults = await modificationLogService.getLogs(objectId, "EventTemplate");

    expect(noResults.length).toEqual(0);

    const retrievedLogs = await modificationLogService.getLogs(objectId, objectType);

    expect(retrievedLogs.length).toEqual(1);

    const retrievedLog = retrievedLogs[0];

    expect(retrievedLog.authorEmail).toEqual(authorEmail);
    expect(retrievedLog.objectId).toEqual(objectId);
    expect(retrievedLog.objectType).toEqual(objectType);
    expect(retrievedLog.newState).toEqual(newState);

    done();
  });
});
