const mongoose = require('mongoose');
const { Location } = require('./dictionaries/location.model');
const { ProjectInfo } = require('./projectInfo.model');
const { setupDB } = require("../setup-test");

setupDB("projectInfo-model");

describe("ProjectInfo Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {

    console.log('MODELS: %j', mongoose.modelNames());

    const testData = {
      locations: ["location1","location2"]
    };

    await Location.create(testData);
    const test = await Location.find();

    const submittedData = {
      name: "projectTest",
      description: "An instance of a Project Info model",
      projectStatus: "Active", // Active, Completed, or Paused
      locationZone: "location1", 
      createdDate: 1594023390039, // date/time project was created
      completedDate: 1594023390039, // only if Status = Completed, date/time completed
      urls: {repository: "https://github.com/hackforla/VRMS"}, // link to main repo
      slackUrl: "hackforla.slack.com", // link to Slack channel
    };

    await ProjectInfo.create(submittedData);
    const savedDataArray = await ProjectInfo.find();
    const savedData = savedDataArray[0];
    expect(savedData.name).toBe(submittedData.name);
    expect(savedData.urls.repository).toBe(submittedData.urls.repository);


    done();
  });
});

describe('CREATE/READ', () => {
  test('Create ProjectInfo with Mongoose model', async (done) => {
    // const submittedData = {
    //   name: 'projectInfoTest',
    // };

    // await ProjectInfo.create(submittedData);
    // const savedDataArray = await ProjectInfo.find();
    // const savedData = savedDataArray[0];
    // expect(savedData.name).toBe(submittedData.name);
    done();
  });
});

describe('UPDATE', () => {
  test('Update ProjectInfo with Mongoose model', async (done) => {
    // const submittedData = {
    //   name: 'projectInfoTest',
    // };

    // await ProjectInfo.create(submittedData);
    // const savedDataArray = await ProjectInfo.find().exec();
    // const savedData = savedDataArray[0];
    // expect(savedData.name).toBe(submittedData.name);

    // const updatedData = { name: 'updatedEventName' };

    // const updatedProjectInfo = await ProjectInfo.findOneAndUpdate(
    //   {_id: savedData._id}, updatedData, {new: true});

    // expect(updatedProjectInfo.name).toBe(updatedData.name);
    done();
  });
});

describe('DELETE', () => {
  test('Delete ProjectInfo with Mongoose model', async (done) => {
  //   const submittedData = {
  //     name: 'ddddd',
  //   };

  //   await ProjectInfo.create(submittedData);
  //   const savedDataArray = await ProjectInfo.find().exec();
  //   const savedData = savedDataArray[0];
  //   expect(savedData.name).toBe(submittedData.name);

  //   const deleteData = await ProjectInfo.deleteOne(submittedData);
  //   expect(deleteData.ok).toBe(1);
    done();
  });
});
