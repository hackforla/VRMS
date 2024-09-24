const { User } = require('./user.model');

const { setupDB } = require("../setup-test");

beforeAll(async () => {
  await setupDB("user-model");
});

// Please add and expand on this simple test.
describe("Question Model saves the correct values", () => {
  test('Save a model instance and then read from the db', async (done) => {
    const submittedData = {
      name: {
        firstName: 'Test',
        lastName: 'User',
      },
      email: 'test@test.com',
      accessLevel: 'user',
      createdDate: 1594023390039,
      currentRole: 'mage',
      desiredRole: 'warlock',
      newMember: true,
      currentJobTitle: 'freehand artist',
      desiredJobTitle: 'textile factory worker',
      skillsToMatch: ['marketing assistant'],
      firstAttended: 'year 0',
      attendanceReason: 'training',
      githubHandle: '@testuser',
      phone: '867-5309',
      textingOk: true,
      slackName: 'slacktestuser',
    };

    await User.create(submittedData);
    const savedDataArray = await User.find();
    const savedData = savedDataArray[0];
    expect(savedData.name.firstName).toBe(submittedData.name.firstName);
    expect(savedData.currentRole).toBe(submittedData.currentRole);
    expect(savedData.desiredJobTitle).toBe(submittedData.desiredJobTitle);
    done();
  });

  test('Create a simple user', async (done) => {
    // Test Data
    const submittedData = {
      name: {
        firstName: 'test',
        lastName: 'user',
      },
      email: 'newtest@test.com',
    };

    await User.create(submittedData);
    const savedDataArray = await User.find();
    const savedData = savedDataArray[0];
    expect(savedData.name.firstName).toBe(submittedData.name.firstName);
    expect(savedData.currentRole).toBe(submittedData.currentRole);
    expect(savedData.desiredJobTitle).toBe(submittedData.desiredJobTitle);
    done();
  });
});
