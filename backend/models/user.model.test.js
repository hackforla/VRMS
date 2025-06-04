// import necessary modules
const mongoose = require('mongoose');
const { User } = require('./user.model');
// MongoDB Memory Server is used for testing purposes to avoid using a real database
const { MongoMemoryServer } = require('mongodb-memory-server');


describe('Unit tests for User Model', () => {
  let mongoServer;
  // Set up in-memory MongoDB server before all tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });
  // Disconnect and stop the in-memory MongoDB server after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  // Clear all collections after each test
  afterEach(async () => {
    // Clean up all collections after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('Serialization test', () => {
    it('should return the correct serialized user object', async () => {
      // Create mock user data
      const userObj = {
        _id: new mongoose.Types.ObjectId(),
        name: {
          firstName: 'mock',
          lastName: 'user',
        },
        email: 'mock.user@example.com',
        accessLevel: 'user',
        createdDate: new Date(),
        currentRole: 'developer',
        desiredRole: 'lead developer',
        newMember: false,
        currentJobTitle: 'Software Engineer',
        desiredJobTitle: 'Senior Software Engineer',
        skillsToMatch: ['Jest', 'Node.js'],
        firstAttended: '2025-01-01',
        attendanceReason: 'To learn and contribute',
        githubHandle: 'mockuser',
        projects: ['ProjectId1', 'ProjectId2'],
        phone: '123-456-7890',
        textingOk: true,
        slackName: 'mockuser',
        isHflaGithubMember: true,
        githubPublic2FA: true,
        availability: 'Weekdays',
        managedProjects: ['Project1', 'Project2'],
        isActive: true,
      };

      // Create a mock user instance
      const mockUser = new User(userObj);
      const serializedUser = mockUser.serialize();

      // Test
      expect(serializedUser).toEqual({
        id: mockUser._id,
        name: {
          firstName: mockUser.name.firstName,
          lastName: mockUser.name.lastName,
        },
        email: mockUser.email,
        accessLevel: mockUser.accessLevel,
        createdDate: mockUser.createdDate,
        currentRole: mockUser.currentRole,
        desiredRole: mockUser.desiredRole,
        newMember: mockUser.newMember,
        currentJobTitle: mockUser.currentRole,
        desiredJobTitle: mockUser.desiredRole,
        skillsToMatch: mockUser.skillsToMatch,
        firstAttended: mockUser.firstAttended,
        attendanceReason: mockUser.attendanceReason,
        githubHandle: mockUser.githubHandle,
        projects: mockUser.projects,
        phone: mockUser.phone,
        textingOk: mockUser.textingOk,
        slackName: mockUser.slackName,
        isHflaGithubMember: mockUser.isHflaGithubMember,
        githubPublic2FA: mockUser.githubPublic2FA,
        availability: mockUser.availability,
        managedProjects: mockUser.managedProjects,
        isActive: mockUser.isActive,
      });
    });
  });

  describe('Validation test', () => {
    it('should fail validation check if user email is not unique', async () => {
      // Create and save a mock user with a specific email
      const mockUser1 = new User({ email: 'mockuser@example.com' });
      await mockUser1.save();

      // Create another mock user with the same email
      const mockUser2 = new User({ email: 'mockuser@example.com' });

      // Attempt to validate the mock user 2 by checking for uniqueness in email
      let error;
      try {
        await mockUser2.save();
      } catch (err) {
        error = err;
      }

      // Tests
      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });

    it('should fail validation check if accessLevel is invalid', async () => {
      // Create a mock user with an invalid accessLevel
      const mockuser = new User({
        accessLevel: 'projectleader', // not 'user', 'admin', or 'superadmin'
      });

      // Attempt to validate the mock user by checking for valid accessLevel
      let error;
      try {
        await mockuser.save();
      } catch (err) {
        error = err;
      }

      // Tests
      expect(error).toBeDefined();
      expect(error.errors.accessLevel).toBeDefined();
    });

    it('should pass validation with valid user data', async () => {
      // Create a mock user with valid data
      const mockUser = new User({
        name: {
          firstName: 'Valid',
          lastName: 'User',
        },
        email: 'mockuser@gmail.com',
        accessLevel: 'user',
      });

      // Attempt to save the mock user
      let error;
      try {
        await mockUser.save();
      } catch (err) {
        error = err;
      }

      // Tests
      expect(error).toBeUndefined();
      expect(mockUser.email).toBe('mockuser@gmail.com');
      expect(mockUser.accessLevel).toBe('user');
      await expect(mockUser.validate()).resolves.toBeUndefined(); // async validation check
    });
  });
});
