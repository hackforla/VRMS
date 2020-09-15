const ProjectTeamMember = require("./projectTeamMember.model");

const { setupDB } = require("../setup-test");
setupDB("projectTeamMember-model");

// Please add and expand on this simple test.
describe("ProjectTeamMember Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      teamMemberStatus: "Inactive", // Active or Inactive
      vrmsProjectAdmin: true, // does this team member have admin rights to the project in VRMS?
      roleOnProject: "Developer", // Developer, Project Manager, UX, Data Science
      joinedDate: 1594023390039, // date/time joined project
      leftDate: 1594023390039, // only if Status = Inactive, date/time went inactive
      leftReason: "other", // project completed, project paused, switched projects, no-show, other
      githubPermissionLevel: "Write", // Write, Triage, Read, Maintainer, or Admin; pull from Github API?
      onProjectGithub: true, // added to the project team on github? pull from github api?
      onProjectGoogleDrive: false, // added to the project team's google drive folder?
    };

    await ProjectTeamMember.create(submittedData);
    const savedDataArray = await ProjectTeamMember.find();
    const savedData = savedDataArray[0];
    expect(savedData.teamMemberStatus === submittedData.teamMemberStatus);
    expect(savedData.joinedDate === submittedData.joinedDate);
    expect(
      savedData.githubPermissionLevel === submittedData.githubPermissionLevel
    );
    done();
  });
});
