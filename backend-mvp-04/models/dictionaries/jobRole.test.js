const { JobRole } = require('./jobRole.model');
const { setupDB } = require("../../setup-test");

setupDB("jobRole-model");

describe("JobRole Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      roles: ["role1","role2"]
    };

    await JobRole.create(submittedData);
    const savedDataArray = await JobRole.find();
    const savedData = savedDataArray[0];
    expect(savedData.roles[0]).toBe(submittedData.roles[0]);
    expect(savedData.roles[1]).toBe(submittedData.roles[1]);

    done();
  });
});

describe('CREATE/READ', () => {
  test('Create JobRole with Mongoose model', async (done) => {
    const submittedData = {
        roles: ["role1","role2"]
    };

    await JobRole.create(submittedData);
    const savedDataArray = await JobRole.find();
    const savedData = savedDataArray[0];
    expect(savedData.roles[0]).toBe(submittedData.roles[0]);
    expect(savedData.roles[1]).toBe(submittedData.roles[1]);
    done();
  });
});

describe('UPDATE', () => {
  test('Update JobRole with Mongoose model', async (done) => {
    const submittedData = {
        roles: ["role1","role2"]
    };

    await JobRole.create(submittedData);
    const savedDataArray = await JobRole.find().exec();
    const savedData = savedDataArray[0];
    expect(savedData.roles[0]).toBe(submittedData.roles[0]);
    expect(savedData.roles[1]).toBe(submittedData.roles[1]);

    const updatedData = { roles: ['role3'] };

    const updatedJobRole = await JobRole.findOneAndUpdate({_id: savedData._id}, updatedData, 
      {new: true});

    expect(updatedJobRole.roles[0]).toBe(updatedData.roles[0]);
    done();
  });
});

describe('DELETE', () => {
  test('Delete JobRole with Mongoose model', async (done) => {
    const submittedData = {
        roles: ['role4'] 
    };

    await JobRole.create(submittedData);
    const savedDataArray = await JobRole.find().exec();
    const savedData = savedDataArray[0];
    expect(savedData.roles[0]).toBe(submittedData.roles[0]);

    const deleteData = await JobRole.deleteOne(submittedData);
    expect(deleteData.ok).toBe(1);
    done();
  });
});
