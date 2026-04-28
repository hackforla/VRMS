// Mock for Project controller
jest.mock('../controllers/project.controller');

// Mock Auth.verifyCookie middleware
const mockVerifyCookie = jest.fn((req, res, next) => next());
jest.mock('../middleware/auth.middleware', () => ({
  verifyCookie: mockVerifyCookie,
}));

// Import Projects router and controller
import ProjectController from '../controllers/project.controller.js';
import projectsRouter from './projects.router.js';
import express from 'express';
import supertest from 'supertest';

// Set up testapp for testing Projects router
const testapp = express();
// Allows for body parsing of JSON data
testapp.use(express.json());
// Allows for body parsing of HTML data
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/projects/', projectsRouter);
const request = supertest(testapp);

describe('Unit testing for Projects router', () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('READ', () => {
    const mockProjects = [
      {
        id: '1',
        name: 'mockProject1',
        description: 'first testing',
        githubIdentifier: 'gitHubTest1',
        projectStatus: 'Active',
        location: 'South LA',
        createdDate: Date.now(),
        completedDate: Date.now(),
        githubUrl: 'https://github.com/mockProject1',
        slackUrl: 'https://slack.com/mockProject1',
        googleDriveUrl: 'https://drive.google.com/mockProject1',
        googleDriveId: '1',
        hflaWebsiteUrl: 'mockHFLAurl',
        videoConferenceLink: 'mockVideoLink',
        lookingDescription: 'n/a',
        recruitingCategories: ['n/a'],
        partners: ['n/a'],
        managedByUsers: ['n/a'],
      },
      {
        id: '2',
        name: 'mockProject2',
        description: 'second testing',
        githubIdentifier: 'gitHubTest2',
        projectStatus: 'Inactive',
        location: 'Bay Area',
        createdDate: Date.now(),
        completedDate: Date.now(),
        githubUrl: 'https://github.com/mockProject2',
        slackUrl: 'https://slack.com/mockProject2',
        googleDriveUrl: 'https://drive.google.com/mockProject2',
        googleDriveId: '2',
        hflaWebsiteUrl: 'mockHFLAurl2',
        videoConferenceLink: 'mockVideoLink2',
        lookingDescription: 'n/a',
        recruitingCategories: ['n/a'],
        partners: ['n/a'],
        managedByUsers: ['n/a'],
      },
    ];

    it('should return a list of projects based on query with GET /api/projects/', async () => {
      ProjectController.project_list.mockImplementationOnce((req, res) => {
        res.status(200).send(mockProjects);
      });

      const response = await request.get('/api/projects');

      expect(ProjectController.project_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
    });

    it('should return a single project with GET /api/projects/:ProjectId', async () => {
      const mockProject = mockProjects[0];
      const ProjectId = mockProject.id;

      ProjectController.project_by_id.mockImplementationOnce((req, res) => {
        res.status(200).send(mockProject);
      });

      const response = await request.get(`/api/projects/${ProjectId}`);

      expect(ProjectController.project_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId } }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);
    });
  });

  describe('CREATE', () => {
    const newProject = {
      id: '3',
      name: 'mockProject3',
      description: 'first testing',
      githubIdentifier: 'gitHubTest3',
      projectStatus: 'Active',
      location: 'LA',
      createdDate: Date.now(),
      completedDate: Date.now(),
      githubUrl: 'https://github.com/mockProject3',
      slackUrl: 'https://slack.com/mockProject3',
      googleDriveUrl: 'https://drive.google.com/mockProject3',
      googleDriveId: '3',
      hflaWebsiteUrl: 'mockHFLAurl',
      videoConferenceLink: 'mockVideoLink',
      lookingDescription: 'n/a',
      recruitingCategories: ['n/a'],
      partners: ['n/a'],
      managedByUsers: ['n/a'],
    };

    it('should create a new project with POST /api/projects', async () => {
      ProjectController.create.mockImplementationOnce((req, res) => {
        res.status(201).send(newProject);
      });

      const response = await request.post('/api/projects').send(newProject);

      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      expect(ProjectController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newProject }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newProject);
    });
  });

  describe('UPDATE', () => {
    const filteredProjects = [
      {
        id: '1',
        name: 'Filtered Project 1',
        description: 'Filtered description 1',
        projectStatus: 'Active',
        githubIdentifier: 'gitHubTest1',
        location: 'South LA',
        createdDate: Date.now(),
        completedDate: Date.now(),
        githubUrl: 'https://github.com/mockProject1',
        slackUrl: 'https://slack.com/mockProject1',
        googleDriveUrl: 'https://drive.google.com/mockProject1',
        googleDriveId: '1',
        hflaWebsiteUrl: 'mockHFLAurl',
        videoConferenceLink: 'mockVideoLink',
        lookingDescription: 'n/a',
        recruitingCategories: ['n/a'],
        partners: ['n/a'],
        managedByUsers: ['n/a'],
      },
      {
        id: '2',
        name: 'Filtered Project 2',
        description: 'Filtered description 2',
        projectStatus: 'Inactive',
        githubIdentifier: 'gitHubTest1',
        location: 'South LA',
        createdDate: Date.now(),
        completedDate: Date.now(),
        githubUrl: 'https://github.com/mockProject1',
        slackUrl: 'https://slack.com/mockProject1',
        googleDriveUrl: 'https://drive.google.com/mockProject1',
        googleDriveId: '1',
        hflaWebsiteUrl: 'mockHFLAurl',
        videoConferenceLink: 'mockVideoLink',
        lookingDescription: 'n/a',
        recruitingCategories: ['n/a'],
        partners: ['n/a'],
        managedByUsers: ['n/a'],
      },
    ];

    it('should return a filed list of projects for PMs with PUT /api/projects', async () => {
      ProjectController.pm_filtered_projects.mockImplementationOnce((req, res) => {
        res.status(200).send(filteredProjects);
      });

      const response = await request.put('/api/projects');

      expect(ProjectController.pm_filtered_projects).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(filteredProjects);
    });

    const updatedProject = {
      id: 'projectId1',
      name: 'updated project1',
      description: 'updated testing',
      githubIdentifier: 'gitHubTest3',
      projectStatus: 'Active',
      location: 'New York',
      createdDate: Date.now(),
      completedDate: Date.now(),
      githubUrl: 'https://github.com/updateProject',
      slackUrl: 'https://slack.com/updateProject',
      googleDriveUrl: 'https://drive.google.com/updateProject',
      googleDriveId: '2',
      hflaWebsiteUrl: 'updatedURL',
      videoConferenceLink: 'updatedURL',
      lookingDescription: 'n/a',
      recruitingCategories: ['n/a'],
      partners: ['n/a'],
      managedByUsers: ['userId1'],
    };

    const ProjectId = updatedProject.id;

    it('should return an updated project with PUT /api/projects/:ProjectId', async () => {
      ProjectController.update.mockImplementationOnce((req, res) => {
        res.status(200).send(updatedProject);
      });

      const response = await request.put(`/api/projects/${ProjectId}`).send(updatedProject);

      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      expect(ProjectController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId } }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProject);
    });

    const updatedUser = {
      id: 'userId1',
      name: 'Updated User',
      email: 'mockuser@example.com',
      managedProjects: ['projectId1'],
    };

    const userId = updatedUser.id;

    it("should add to the project's managedByUsers and the user's managedProjects fields with PATCH /api/projects/:ProjectId", async () => {
      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });

      const response = await request
        .patch(`/api/projects/${ProjectId}`)
        .send({ action: 'add', userId });

      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      expect(ProjectController.updateManagedByUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { ProjectId },
          body: { action: 'add', userId },
        }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });
    });

    it("should remove user from the project's managedByUsers and remove project from the user's managedProjects fields with PATCH /api/projects/:ProjectId", async () => {
      updatedProject.managedByUsers = [];
      updatedUser.managedProjects = [];

      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });

      const response = await request
        .patch(`/api/projects/${ProjectId}`)
        .send({ action: 'remove', userId });

      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      expect(ProjectController.updateManagedByUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { ProjectId },
          body: { action: 'remove', userId },
        }),
        expect.anything(),
        expect.anything(),
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });
    });
  });
});
