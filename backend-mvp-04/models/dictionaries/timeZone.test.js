const { TimeZone } = require('./timeZone.model');
const { setupDB } = require("../../setup-test");

setupDB("timeZone-model");

describe("TimeZone Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      timeZones: ["zone1","zone2"]
    };

    await TimeZone.create(submittedData);
    const savedDataArray = await TimeZone.find();
    const savedData = savedDataArray[0];
    expect(savedData.timeZones[0]).toBe(submittedData.timeZones[0]);
    expect(savedData.timeZones[1]).toBe(submittedData.timeZones[1]);

    done();
  });
});

describe('CREATE/READ', () => {
  test('Create TimeZone with Mongoose model', async (done) => {
    const submittedData = {
      timeZones: ["zone1","zone2"]
    };

    await TimeZone.create(submittedData);
    const savedDataArray = await TimeZone.find();
    const savedData = savedDataArray[0];
    expect(savedData.timeZones[0]).toBe(submittedData.timeZones[0]);
    expect(savedData.timeZones[1]).toBe(submittedData.timeZones[1]);
    done();
  });
});

describe('UPDATE', () => {
  test('Update TimeZone with Mongoose model', async (done) => {
    const submittedData = {
      timeZones: ["zone1","zone2"]
    };

    await TimeZone.create(submittedData);
    const savedDataArray = await TimeZone.find().exec();
    const savedData = savedDataArray[0];
    expect(savedData.timeZones[0]).toBe(submittedData.timeZones[0]);
    expect(savedData.timeZones[1]).toBe(submittedData.timeZones[1]);

    const updatedData = { timeZones: ['zone3'] };

    const updatedTimeZone = await TimeZone.findOneAndUpdate({_id: savedData._id}, updatedData, 
      {new: true});

    expect(updatedTimeZone.timeZones[0]).toBe(updatedData.timeZones[0]);
    done();
  });
});

describe('DELETE', () => {
  test('Delete TimeZone with Mongoose model', async (done) => {
    const submittedData = {
      timeZones: ['zone4'] 
    };

    await TimeZone.create(submittedData);
    const savedDataArray = await TimeZone.find().exec();
    const savedData = savedDataArray[0];
    expect(savedData.timeZones[0]).toBe(submittedData.timeZones[0]);

    const deleteData = await TimeZone.deleteOne(submittedData);
    expect(deleteData.ok).toBe(1);
    done();
  });
});
