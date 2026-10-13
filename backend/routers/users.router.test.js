import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';

// Setup mocks for UserController
vi.mock('../controllers/user.controller');
// Mock Auth middleware so UPDATE/DELETE routes (which require Auth.authUser) pass through
vi.mock('../middleware/index.js', () => ({
  Auth: {
    authUser: vi.fn((req, res, next) => next()),
    requireMinimumRole: vi.fn(() => (req, res, next) => next()),
  },
}));
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
  const mockUser = { id: 'userId1', name: { firstName: 'test', lastName: 'user' }, email: 'newtest@test.com', accessLevel: 'admin', managedProjects: ['projectId1'] };
  const mockUserId = mockUser.id;
  const mockUpdatedEmail = mockUser.email;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('CREATE', () => {
    it('should create a User through the UserController', async () => {
      UserController.create.mockImplementationOnce((req, res) => { return res.status(201).send(mockUser); });
      const response = await request.post('/api/users/').send(mockUser);
      expect(UserController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: mockUser }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('READ', () => {
    it('should get a list of Users', async () => {
      UserController.user_list.mockImplementationOnce((req, res) => { return res.status(200).send([mockUser]); });
      const response = await request.get('/api/users/');
      expect(UserController.user_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get a specific User by email query', async () => {
      UserController.user_list.mockImplementationOnce((req, res) => { return res.status(200).send([mockUser]); });
      const response = await request.get('/api/users?email=newtest@test.com');
      expect(UserController.user_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get admins list', async () => {
      UserController.admin_list.mockImplementationOnce((req, res) => { return res.status(200).send([mockUser]); });
      const response = await request.get('/api/users/admins');
      expect(UserController.admin_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it('should get project managers list', async () => {
      UserController.projectManager_list.mockImplementationOnce((req, res) => { return res.status(200).send([mockUser]); });
      const response = await request.get('/api/users/projectManagers');
      expect(UserController.projectManager_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(mockUser);
    });

    it.skip('should get a specific User by UserId', async () => {
      UserController.user_by_id.mockImplementationOnce((req, res) => { return res.status(200).send(mockUser); });
      const response = await request.get(`/api/users/${mockUserId}`);
      expect(UserController.user_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('UPDATE', () => {
    it('should update a User', async () => {
      UserController.update.mockImplementationOnce((req, res) => { return res.status(200).send(mockUser); });
      const response = await request.patch(`/api/users/${mockUserId}`).send(mockUpdatedEmail);
      expect(UserController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    const mockProject = { id: 'projectId1', name: 'Test Project', managedByUsers: [mockUserId] };
    const projectId = mockProject.id;

    it("should add to managedProjects", async () => {
      UserController.updateManagedProjects.mockImplementationOnce((req, res) => {
        return res.status(200).send({ user: mockUser, project: mockProject });
      });
      const response = await request.patch(`/api/users/${mockUserId}/managedProjects`).send({ action: 'add', projectId });
      expect(UserController.updateManagedProjects).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId }, body: { action: 'add', projectId } }),
        expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, project: mockProject });
    });

    it("should remove from managedProjects", async () => {
      mockProject.managedByUsers = [];
      mockUser.managedProjects = [];
      UserController.updateManagedProjects.mockImplementationOnce((req, res) => {
        return res.status(200).send({ user: mockUser, project: mockProject });
      });
      const response = await request.patch(`/api/users/${mockUserId}/managedProjects`).send({ action: 'remove', projectId });
      expect(UserController.updateManagedProjects).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId }, body: { action: 'remove', projectId } }),
        expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, project: mockProject });
    });
  });

  describe('DELETE', () => {
    it('should delete a user', async () => {
      UserController.delete.mockImplementationOnce((req, res) => { return res.status(200).send(mockUser); });
      const response = await request.delete(`/api/users/${mockUserId}`).send(mockUpdatedEmail);
      expect(UserController.delete).toHaveBeenCalledWith(
        expect.objectContaining({ params: { UserId: mockUserId } }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });
  });
});
