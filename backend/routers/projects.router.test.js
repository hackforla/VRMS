// Mock for Project controller
jest.mock('../controllers/project.controller');

// Mock AuthUtil.verifyCookie middleware
const mockVerifyCookie = jest.fn((req, res, next) => next());
jest.mock('../middleware/auth.middleware', () => ({
  verifyCookie: mockVerifyCookie,
}));

// Import Projects router and controller
const ProjectController = require('../controllers/project.controller');
const projectsRouter = require('./projects.router');
const express = require('express');
const supertest = require('supertest');

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
    // Mock list of projects
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

    it('should return a list of projects based on query with GET /api/projects/', async (done) => {
      // Mock ProjectController.project_list method when this route is called
      ProjectController.project_list.mockImplementationOnce((req, res) => {
        res.status(200).send(mockProjects);
      });

      // Mock GET API call
      const response = await request.get('/api/projects');

      // Tests
      expect(ProjectController.project_list).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);

      // Marks completion of tests
      done();
    });

    it('should return a single project with GET /api/projects/:ProjectId', async (done) => {
      const mockProject = mockProjects[0];
      const ProjectId = mockProject.id;

      // Mock ProjectController.project_list method when this route is called
      ProjectController.project_by_id.mockImplementationOnce((req, res) => {
        res.status(200).send(mockProject);
      });

      // Mock GET API call
      const response = await request.get(`/api/projects/${ProjectId}`);

      // Tests
      expect(ProjectController.project_by_id).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId } }),
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);

      // Marks completion of tests
      done();
    });
  });

  describe('CREATE', () => {
    // Mock new project
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

    it('should create a new project with POST /api/projects', async (done) => {
      // Mock ProjectController.create method when this route is called
      ProjectController.create.mockImplementationOnce((req, res) => {
        res.status(201).send(newProject);
      });

      // Mock API POST req
      const response = await request.post('/api/projects').send(newProject);

      // Middlware assertions
      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      // Tests
      expect(ProjectController.create).toHaveBeenCalledWith(
        expect.objectContaining({ body: newProject }), // Check if newProject in body is parsed
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newProject);

      // Marks completion of tests
      done();
    });
  });

  describe('UPDATE', () => {
    // Mock filtered projects
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

    it('should return a filed list of projects for PMs with PUT /api/projects', async (done) => {
      // Mock ProjectController.pm_filtered_projects method when this route is called
      ProjectController.pm_filtered_projects.mockImplementationOnce((req, res) => {
        res.status(200).send(filteredProjects);
      });

      // Mock PUT API call
      const response = await request.put('/api/projects');

      // Tests
      expect(ProjectController.pm_filtered_projects).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(filteredProjects);

      // Marks completion of tests
      done();
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

    it('should return an updated project with PUT /api/projects/:ProjectId', async (done) => {
      // Mock ProjectController.update method when this route is called
      ProjectController.update.mockImplementationOnce((req, res) => {
        res.status(200).send(updatedProject);
      });

      // Mock PUT API call
      const response = await request.put(`/api/projects/${ProjectId}`).send(updatedProject);

      // Middlware assertions
      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      // Tests
      expect(ProjectController.update).toHaveBeenCalledWith(
        expect.objectContaining({ params: { ProjectId } }), // Check if ProjectId is parsed from params
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProject);

      // Marks completion of tests
      done();
    });

    const updatedUser = {
      id: 'userId1',
      name: 'Updated User',
      email: 'mockuser@example.com',
      managedProjects: ['projectId1'],
    };

    const userId = updatedUser.id;

    it("should add to the project's managedByUsers and the user's managedProjects fields with PATCH /api/projects/:ProjectId", async (done) => {
      // Mock ProjectController.updateManagedByUsers method when this route is called
      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });

      // Mock PUT API call
      const response = await request
        .patch(`/api/projects/${ProjectId}`)
        .send({ action: 'add', userId });

      // Middlware assertions
      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      // Tests
      expect(ProjectController.updateManagedByUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { ProjectId },
          body: { action: 'add', userId },
        }), // Check if ProjectId is parsed from params
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });

      // Marks completion of tests
      done();
    });

    it("should add to the project's managedByUsers and the user's managedProjects fields with PATCH /api/projects/:ProjectId", async (done) => {
      // Mock ProjectController.updateManagedByUsers method when this route is called
      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });

      // Mock PUT API call
      const response = await request
        .patch(`/api/projects/${ProjectId}`)
        .send({ action: 'add', userId });

      // Middlware assertions
      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      // Tests
      expect(ProjectController.updateManagedByUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { ProjectId },
          body: { action: 'add', userId },
        }), // Check if ProjectId is parsed from params
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });

      // Marks completion of tests
      done();
    });

    it("should remove user from the project's managedByUsers and remove project from the user's managedProjects fields with PATCH /api/projects/:ProjectId", async (done) => {
      updatedProject.managedByUsers = [];
      updatedUser.managedProjects = [];

      // Mock ProjectController.updateManagedByUsers method when this route is called
      ProjectController.updateManagedByUsers.mockImplementationOnce((req, res) => {
        res.status(200).send({ project: updatedProject, user: updatedUser });
      });

      // Mock PUT API call
      const response = await request
        .patch(`/api/projects/${ProjectId}`)
        .send({ action: 'remove', userId });

      // Middlware assertions
      expect(mockVerifyCookie).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Function),
      );

      // Tests
      expect(ProjectController.updateManagedByUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { ProjectId },
          body: { action: 'remove', userId },
        }), // Check if ProjectId is parsed from params
        expect.anything(), // Mock response
        expect.anything(), // Mock next
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ project: updatedProject, user: updatedUser });

      // Marks completion of tests
      done();
    });
  });
});
