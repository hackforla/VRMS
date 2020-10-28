const UserProfile = require("./userProfile.model");

const { setupDB } = require("../setup-test");

setupDB("userProfile-model");

// Please add and expand on this simple test.
describe("UserProfile Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      firstName: "Test",
      lastName: "User",
      meetLocation: "a location",
      timeZone: "a timezone",		
      signupEmail: "test@test.com",
      phone: "867-5309",
      isTextingAllowed: true, 
      isCodeOfConductAccepted: true, 
      googleEmail: "test@test.com",
      isGoogleEmailOk: true, 
      isAdmin: true, 
      isActive: true, 
      createdDate: 1594023390039,
      github: {
        username: "aUsername",	
        isConnected: true,	
        is2FaOn: true,	
        isMembershipPublic: true
      },
      slack: {
        id: "slackId",			
        username: "slackusername",		
        isConnected: true		
      },
      lastCheckDate: 1594023390039,	
      currentJobTitle: "title",		
      linkedInAccount: "linkedInAccount",
      targetCareer: "targetCareerTest",			
      desiredRoles: "roles desired",		
      currentTechSkills: ["techskill1", "techskill2"],
      targetTechSkills: ["targetTechSkill1", "targetTechSkill2"],
      currentSkills: ["currentSkill1", "currentSkill2"],
      targetSkills: ["targetSkill1", "targetSkill2"],	
      onboardingStatus: {
        googleAccount: true,
        codeOfConduct: true,
        baseInfo: true,
        slack: true,
        github: true,
        profile: true,
        team: true,
        call: true,
        finalInfo: true,
        careerInfo: true,
        github2Fa: true
      }
    };

    await UserProfile.create(submittedData);
    const savedDataArray = await UserProfile.find();
    const savedData = savedDataArray[0];
    expect(savedData.firstName === submittedData.firstName);
    expect(savedData.github.username === submittedData.github.username);
    expect(savedData.onboardingStatus.googleAccount 
      === submittedData.onboardingStatus.googleAccount);
    done();
  });
});
