const Project = require("../../models/project.model");
const dbHandler = require("../db-handler");

// Required database setup and teardown
beforeAll(async () => await dbHandler.connect());
afterAll(async () => await dbHandler.closeDatabase());

describe("Project Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      name: "projectTest",
      description: "An instance of a Project model",
      githubIdentifier: "VRMS",
      projectStatus: "Active", // Active, Completed, or Paused
      location: "Remote", // DTLA, Westside, South LA, or Remote (hacknight)
      createdDate: 1594023390039, // date/time project was created
      completedDate: 1594023390039, // only if Status = Completed, date/time completed
      githubUrl: "https://github.com/hackforla/VRMS", // link to main repo
      slackUrl: "hackforla.slack.com", // link to Slack channel
    };

    await Project.create(submittedData);
    const savedDataArray = await Project.find();
    const savedData = savedDataArray[0];
    expect(savedData.name === submittedData.name);
    expect(savedData.githubIdentifier === submittedData.githubIdentifier);
    expect(savedData.githubUrl === submittedData.githubUrl);
    done();
  });
});
