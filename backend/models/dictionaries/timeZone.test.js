const { Location } = require('./location.model');
const { setupDB } = require("../../setup-test");

setupDB("project-model");

describe("Location Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      locations: ["location1","location2"]
    };

    await Location.create(submittedData);
    const savedDataArray = await Location.find();
    const savedData = savedDataArray[0];
    expect(savedData.locations[0]).toBe(submittedData.locations[0]);
    expect(savedData.locations[1]).toBe(submittedData.locations[1]);

    done();
  });
});

describe('CREATE/READ', () => {
  test('Create Location with Mongoose model', async (done) => {
    const submittedData = {
      locations: ["location1","location2"]
    };

    await Location.create(submittedData);
    const savedDataArray = await Location.find();
    const savedData = savedDataArray[0];
    expect(savedData.locations[0]).toBe(submittedData.locations[0]);
    expect(savedData.locations[1]).toBe(submittedData.locations[1]);
    done();
  });
});

describe('UPDATE', () => {
  test('Update Location with Mongoose model', async (done) => {
    const submittedData = {
      locations: ["location1","location2"]
    };

    await Location.create(submittedData);
    const savedDataArray = await Location.find().exec();
    const savedData = savedDataArray[0];
    expect(savedData.locations[0]).toBe(submittedData.locations[0]);
    expect(savedData.locations[1]).toBe(submittedData.locations[1]);

    const updatedData = { locations: ['location3'] };

    const updatedLocation = await Location.findOneAndUpdate({_id: savedData._id}, updatedData, 
      {new: true});

    expect(updatedLocation.locations[0]).toBe(updatedData.locations[0]);
    done();
  });
});

describe('DELETE', () => {
  test('Delete Location with Mongoose model', async (done) => {
    const submittedData = {
      locations: ['location4'] 
    };

    await Location.create(submittedData);
    const savedDataArray = await Location.find().exec();
    const savedData = savedDataArray[0];
    expect(savedData.locations[0]).toBe(submittedData.locations[0]);

    const deleteData = await Location.deleteOne(submittedData);
    expect(deleteData.ok).toBe(1);
    done();
  });
});
