const { ModificationLog } = require('./modificationLog.model');
const { setupDB } = require("../setup-test");

setupDB("modificationLog-model");

// Please add and expand on this simple test.
describe("ModificationLog Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      date: 1594023390039, 
      authorEmail: "foo@bar.com", 
      objectId: "1", 
      objectType: "UserProfile", 
      newState: {name: "Foo"} 
    };

    await ModificationLog.create(submittedData);
    const savedDataArray = await ModificationLog.find();
    const savedData = savedDataArray[0];
    expect(savedData.date.getTime()).toEqual(submittedData.date);
    expect(savedData.authorEmail).toEqual(submittedData.authorEmail);
    expect(savedData.objectId).toEqual(submittedData.objectId);
    expect(savedData.objectType).toEqual(submittedData.objectType);
    expect(savedData.newState).toEqual(submittedData.newState);
    done();
  });
});
