// Setup mocks for UserController
jest.mock('../controllers/user.controller');
const { UserController } = require('../controllers');

// Must import usersRouter after setting up mocks for UserController
const usersRouter = require('./users.router');
import express from 'express';
import supertest from 'supertest';

// Setup testapp with just usersRouter which calls mocked UserController
const testapp = express();
testapp.use(express.json());
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/users', usersRouter);
const request = supertest(testapp);

describe('Unit Tests for userRouter', () => {
  // Mocked user data
  const mockUser = {
    id: 'userId1',
    name: {
      firstName: 'test',
      lastName: 'user',
    },
    email: 'newtest@test.com',
    accessLevel: 'admin',
    managedProjects: ['projectId1'],
  };
  const mockUserId = mockUser.id;
  const mockUpdatedEmail = mockUser.email;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CREATE', () => {
    it('should create a User through the UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.create.mockImplementationOnce((req, res) => {
        return res.status(201).send(mockUser);
      });

      //Functionality
      //Post mockUser to CREATE API Endpoint
      const response = await request.post('/api/users/').send(mockUser);

      //Test
      expect(UserController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: mockUser }),
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next function
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('READ', () => {
    it('should get a list of Users with with GET to /api/users/ through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.user_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      //Functionality
      //Get list of all users from READ API Endpoint
      const response = await request.get('/api/users/');

      //Test
      expect(UserController.user_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a specific User by param with GET to /api/users?email=<query> through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.user_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      //Functionality
      //Get a user with a specific email using a query param to READ API Endpoint
      const response = await request.get('/api/users?email=newtest@test.com');

      //Test
      expect(UserController.user_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a list of Users with accessLevel of admin or superadmin with GET to /api/users/admins through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.admin_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      //Functionality
      //Get a list of admins and superadmins from READ API Endpoint for admins
      const response = await request.get('/api/users/admins');

      //Test
      expect(UserController.admin_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a list of Users with the ability to manage projects with GET to /api/users/projectManagers through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.projectManager_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      //Functionality
      //Get a list of project leads and admins from READ API Endpoint for project leads
      const response = await request.get('/api/users/projectManagers');

      //Test
      expect(UserController.projectManager_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    // @TODO: Fix failing test, require investigation. Please referece issue 2036
    it.skip('should get a specific User by UserId with GET to /api/users/:UserId through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.user_by_id.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockUser);
      });

      //Functionality
      //Get a specific user from READ API Endpoint for specific UUIDs
      const response = await request.get(`/api/users/${mockUserId}`);

      //Test
      expect(UserController.user_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }),
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next function
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('UPDATE', () => {
    it('should update a User with PATCH to /api/users/:UserId through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.update.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockUser);
      });

      //Functionality
      //Patch a user with a specific id by sending new user data to UPDATE API Endpoint
      const response = await request.patch(`/api/users/${mockUserId}`).send(mockUpdatedEmail);

      //Test
      expect(UserController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }),
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next function
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    // Create mock project and add userId to managedByUsers
    const mockProject = {
      id: 'projectId1',
      name: 'Test Project',
      managedByUsers: [mockUserId],
    };
    const projectId = mockProject.id;

    it("should add projectId to user's managedProjects and userId to project's managedByUsers with PATCH /api/users/:UserId/managedProjects", async () => {
      // Mock the response of UserController.updateManagedProjects
      UserController.updateManagedProjects.mockImplementationOnce((req, res) => {
        return res.status(200).send({ user: mockUser, project: mockProject });
      });

      // Send PATCH request to update managedProjects
      const response = await request.patch(`/api/users/${mockUserId}/managedProjects`).send({
        action: 'add',
        projectId: projectId,
      });

      // Tests
      expect(UserController.updateManagedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { UserId: mockUserId },
          body: { action: 'add', projectId },
        }),
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next function
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, project: mockProject });
    });

    it("should remove projectId in user's managedProjects and userId in project's managedByUsers with PATCH /api/users/:UserId/managedProjects", async () => {
      // Remove projectId and userId from fields
      mockProject.managedByUsers = [];
      mockUser.managedProjects = [];

      // Mock the response of UserController.updateManagedProjects
      UserController.updateManagedProjects.mockImplementationOnce((req, res) => {
        return res.status(200).send({ user: mockUser, project: mockProject });
      });

      // Send PATCH request to update managedProjects
      const response = await request.patch(`/api/users/${mockUserId}/managedProjects`).send({
        action: 'remove',
        projectId: projectId,
      });

      // Tests
      expect(UserController.updateManagedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { UserId: mockUserId },
          body: { action: 'remove', projectId },
        }),
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next function
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, project: mockProject });
    });
  });

  describe('DELETE', () => {
    it('should delete a specific user by Id with DELETE /api/users/:UserId through UserController', async () => {
      //Mock the UserController function that this route calls with expected results
      UserController.delete.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockUser);
      });

      //Delete user with a specific id via a request to DELETE API Endpoint
      const response = await request.delete(`/api/users/${mockUserId}`).send(mockUpdatedEmail);

      //Test
      expect(UserController.delete).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }),
        expect.anything(), // Mock the response object
        expect.anything(), // Mock the next function
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });
});
