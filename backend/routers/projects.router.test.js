import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';

// Mock for Project controller
vi.mock('../controllers/project.controller');

// Mock Auth.verifyCookie middleware
const mockVerifyCookie = vi.fn((req, res, next) => next());
vi.mock('../middleware/auth.middleware', () => ({
  verifyCookie: mockVerifyCookie,
}));

// Import Projects router and controller
import ProjectController from '../controllers/project.controller.js';
import projectsRouter from './projects.router.js';
import express from 'express';
import supertest from 'supertest';

// Set up testapp for testing Projects router
const testapp = express();
testapp.use(express.json());
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/projects/', projectsRouter);
const request = supertest(testapp);

describe('Unit testing for Projects router', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('READ', () => {
    const mockProjects = [
      { id: '1', name: 'mockProject1', description: 'first testing', githubIdentifier: 'gitHubTest1', projectStatus: 'Active', location: 'South LA', createdDate: Date.now(), completedDate: Date.now(), githubUrl: 'https://github.com/mockProject1', slackUrl: 'https://slack.com/mockProject1', googleDriveUrl: 'https://drive.google.com/mockProject1', googleDriveId: '1', hflaWebsiteUrl: 'mockHFLAurl', videoConferenceLink: 'mockVideoLink', lookingDescription: 'n/a', recruitingCategories: ['n/a'], partners: ['n/a'], managedByUsers: ['n/a'] },
      { id: '2', name: 'mockProject2', description: 'second testing', githubIdentifier: 'gitHubTest2', projectStatus: 'Inactive', location: 'Bay Area', createdDate: Date.now(), completedDate: Date.now(), githubUrl: 'https://github.com/mockProject2', slackUrl: 'https://slack.com/mockProject2', googleDriveUrl: 'https://drive.google.com/mockProject2', googleDriveId: '2', hflaWebsiteUrl: 'mockHFLAurl2', videoConferenceLink: 'mockVideoLink2', lookingDescription: 'n/a', recruitingCategories: ['n/a'], partners: ['n/a'], managedByUsers: ['n/a'] },
    ];

    it('should return a list of projects', async () => {
      ProjectController.project_list.mockImplementationOnce((req, res) => { res.status(200).send(mockProjects); });
      const response = await request.get('/api/projects');
      expect(ProjectController.project_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
    });

    it('should return a single project', async () => {
      const mockProject = mockProjects[0];
      const ProjectId = mockProject.id;
      ProjectController.project_by_id.mockImplementationOnce((req, res) => { res.status(200).send(mockProject); });
      const response = await request.get(`/api/projects/${ProjectId}`);
      expect(ProjectController.project_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId } }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);
    });
  });

  describe('CREATE', () => {
    const newProject = { id: '3', name: 'mockProject3', description: 'first testing', githubIdentifier: 'gitHubTest3', projectStatus: 'Active', location: 'LA', createdDate: Date.now(), completedDate: Date.now(), githubUrl: 'https://github.com/mockProject3', slackUrl: 'https://slack.com/mockProject3', googleDriveUrl: 'https://drive.google.com/mockProject3', googleDriveId: '3', hflaWebsiteUrl: 'mockHFLAurl', videoConferenceLink: 'mockVideoLink', lookingDescription: 'n/a', recruitingCategories: ['n/a'], partners: ['n/a'], managedByUsers: ['n/a'] };

    it('should create a new project with POST /api/projects', async () => {
      ProjectController.create.mockImplementationOnce((req, res) => { res.status(201).send(newProject); });
      const response = await request.post('/api/projects').send(newProject);
      expect(mockVerifyCookie).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));
      expect(ProjectController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newProject }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newProject);
    });
  });

  describe('UPDATE', () => {
    const updatedProject = { id: 'projectId1', name: 'updated project1', managedByUsers: ['userId1'] };
    const ProjectId = updatedProject.id;
    const updatedUser = { id: 'userId1', name: 'Updated User', email: 'mockuser@example.com', managedProjects: ['projectId1'] };
    const userId = updatedUser.id;

    it('should return an updated project with PUT /api/projects/:ProjectId', async () => {
      ProjectController.update.mockImplementationOnce((req, res) => { res.status(200).send(updatedProject); });
      const response = await request.put(`/api/projects/${ProjectId}`).send(updatedProject);
      expect(mockVerifyCookie).toHaveBeenCalled();
      expect(ProjectController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId } }), expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProject);
    });

    it("should add to managedByUsers with PATCH /api/projects/:ProjectId", async () => {
      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });
      const response = await request.patch(`/api/projects/${ProjectId}`).send({ action: 'add', userId });
      expect(mockVerifyCookie).toHaveBeenCalled();
      expect(ProjectController.updateManagedByUsers).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId }, body: { action: 'add', userId } }),
        expect.anything(), expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });
    });

    it("should remove from managedByUsers with PATCH /api/projects/:ProjectId", async () => {
      updatedProject.managedByUsers = [];
      updatedUser.managedProjects = [];
      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });
      const response = await request.patch(`/api/projects/${ProjectId}`).send({ action: 'remove', userId });
      expect(mockVerifyCookie).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });
    });
  });
});
