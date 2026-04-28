// Setup mocks for UserController
jest.mock('../controllers/user.controller');
import { UserController } from '../controllers/index.js';

// Must import usersRouter after setting up mocks for UserController
import usersRouter from './users.router.js';
import express from 'express';
import supertest from 'supertest';

// Setup testapp with just usersRouter which calls mocked UserController
const testapp = express();
testapp.use(express.json());
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/users', usersRouter);
const request = supertest(testapp);

describe('Unit Tests for userRouter', () => {
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
      UserController.create.mockImplementationOnce((req, res) => {
        return res.status(201).send(mockUser);
      });

      const response = await request.post('/api/users/').send(mockUser);

      expect(UserController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: mockUser }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('READ', () => {
    it('should get a list of Users with with GET to /api/users/ through UserController', async () => {
      UserController.user_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      const response = await request.get('/api/users/');

      expect(UserController.user_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a specific User by param with GET to /api/users?email=<query> through UserController', async () => {
      UserController.user_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      const response = await request.get('/api/users?email=newtest@test.com');

      expect(UserController.user_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a list of Users with accessLevel of admin or superadmin with GET to /api/users/admins through UserController', async () => {
      UserController.admin_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      const response = await request.get('/api/users/admins');

      expect(UserController.admin_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a list of Users with the ability to manage projects with GET to /api/users/projectManagers through UserController', async () => {
      UserController.projectManager_list.mockImplementationOnce((req, res) => {
        return res.status(200).send([mockUser]);
      });

      const response = await request.get('/api/users/projectManagers');

      expect(UserController.projectManager_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    // @TODO: Fix failing test, require investigation. Please referece issue 2036
    it.skip('should get a specific User by UserId with GET to /api/users/:UserId through UserController', async () => {
      UserController.user_by_id.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockUser);
      });

      const response = await request.get(`/api/users/${mockUserId}`);

      expect(UserController.user_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('UPDATE', () => {
    it('should update a User with PATCH to /api/users/:UserId through UserController', async () => {
      UserController.update.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockUser);
      });

      const response = await request.patch(`/api/users/${mockUserId}`).send(mockUpdatedEmail);

      expect(UserController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    const mockProject = {
      id: 'projectId1',
      name: 'Test Project',
      managedByUsers: [mockUserId],
    };
    const projectId = mockProject.id;

    it("should add projectId to user's managedProjects and userId to project's managedByUsers with PATCH /api/users/:UserId/managedProjects", async () => {
      UserController.updateManagedProjects.mockImplementationOnce((req, res) => {
        return res.status(200).send({ user: mockUser, project: mockProject });
      });

      const response = await request.patch(`/api/users/${mockUserId}/managedProjects`).send({
        action: 'add',
        projectId: projectId,
      });

      expect(UserController.updateManagedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { UserId: mockUserId },
          body: { action: 'add', projectId },
        }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, project: mockProject });
    });

    it("should remove projectId in user's managedProjects and userId in project's managedByUsers with PATCH /api/users/:UserId/managedProjects", async () => {
      mockProject.managedByUsers = [];
      mockUser.managedProjects = [];

      UserController.updateManagedProjects.mockImplementationOnce((req, res) => {
        return res.status(200).send({ user: mockUser, project: mockProject });
      });

      const response = await request.patch(`/api/users/${mockUserId}/managedProjects`).send({
        action: 'remove',
        projectId: projectId,
      });

      expect(UserController.updateManagedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { UserId: mockUserId },
          body: { action: 'remove', projectId },
        }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, project: mockProject });
    });
  });

  describe('DELETE', () => {
    it('should delete a specific user by Id with DELETE /api/users/:UserId through UserController', async () => {
      UserController.delete.mockImplementationOnce((req, res) => {
        return res.status(200).send(mockUser);
      });

      const response = await request.delete(`/api/users/${mockUserId}`).send(mockUpdatedEmail);

      expect(UserController.delete).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });
});
