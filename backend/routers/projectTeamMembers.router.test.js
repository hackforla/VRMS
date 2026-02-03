// Mock and import project team model
jest.mock('../models/projectTeamMember.model');
const { ProjectTeamMember } = require('../models');

// Import project team router
const ProjectTeamRouter = require('./projectTeamMembers.router');

// Create test app with express
const express = require('express');
const supertest = require('supertest');
const testapp = express();
// Allow for body parsing in test
testapp.use(express.json());
testapp.use('/api/projectteammembers', ProjectTeamRouter);
const request = supertest(testapp);

describe('Unit testing for project team members router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('READ', () => {
    // Mock project team members
    const mockMembers = [
      {
        id: 1,
        userId: '1',
        projectId: '1',
        teamMemberStatus: 'active',
        vrmsProjectAdmin: false,
        roleOnProject: 'Developer',
        joinedDate: Date.now(),
        leftDate: Date.now(),
        leftReason: 'n/a',
        githubPermissionLevel: 'admin',
        onProjectGithub: true,
        onProjectGoogleDrive: true,
      },
      {
        id: 2,
        userId: '2',
        projectId: '2',
        teamMemberStatus: 'active',
        vrmsProjectAdmin: true,
        roleOnProject: 'Project Manager',
        joinedDate: Date.now(),
        leftDate: Date.now(),
        leftReason: 'n/a',
        githubPermissionLevel: 'admin',
        onProjectGithub: true,
        onProjectGoogleDrive: true,
      },
    ];

    it('should return a list of project team members with GET /api/projectteammembers/', async () => {
      // Mock resolved value of ProjectTeamMember.find() method
      ProjectTeamMember.find.mockReturnValue({
        populate: jest.fn((path) => {
          if (path !== 'userId') throw new Error('Incorrect populate path');
          return {
            then: (callBack) => callBack(mockMembers),
          };
        }),
      });

      // Mock API response
      const response = await request.get('/api/projectteammembers');

      // Tests
      expect(ProjectTeamMember.find().populate).toHaveBeenCalledWith('userId');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMembers);

      // Marks completion of tests
    });

    it('should return a single project team member based on projectId with GET /api/projectteammembers/:id', async () => {
      const mockMember = mockMembers[0];
      const projectId = mockMember.projectId;

      // Mock resolved value of ProjectTeamMember.find({ projectId }) method
      ProjectTeamMember.find.mockReturnValue({
        populate: jest.fn((path) => {
          if (path !== 'userId') throw new Error('Incorrect populate path');
          return {
            then: (callBack) => callBack(mockMember),
          };
        }),
      });

      // Mock GET API response
      const response = await request.get(`/api/projectteammembers/${projectId}`);

      // Tests
      expect(ProjectTeamMember.find).toHaveBeenCalledWith({ projectId: projectId });
      expect(ProjectTeamMember.find().populate).toHaveBeenCalledWith('userId');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);

      // Marks completion of tests
    });

    it('should return a specific project team member based on projectId and userId with GET /api/projectteammembers/project/:id/:userId', async () => {
      const mockMember = mockMembers[1];
      const projectId = mockMember.projectId;
      const userId = mockMember.userId;

      // Mock resolved value of ProjectTeamMember.find({ projectId, userId }) method
      ProjectTeamMember.find.mockReturnValue({
        populate: jest.fn((path) => {
          if (path !== 'userId') throw new Error('Incorrect populate path');
          return {
            then: (callBack) => callBack(mockMember),
          };
        }),
      });

      // Mock GET API response
      const response = await request.get(`/api/projectteammembers/project/${projectId}/${userId}`);

      // Tests
      expect(ProjectTeamMember.find).toHaveBeenCalledWith({ projectId: projectId, userId: userId });
      expect(ProjectTeamMember.find().populate).toHaveBeenCalledWith('userId');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);

      // Marks completion of tests
    });

    it('should return a specific project owner that IS an vrmsProjectAdmin on userId with GET /api/projectteammembers/projectowner/:id', async () => {
      const mockMember = mockMembers[1];
      const userId = mockMember.userId;

      // Mock resolved value of ProjectTeamMember.findOne() method
      ProjectTeamMember.findOne.mockImplementation(() => ({
        populate: jest.fn().mockImplementationOnce((path) => {
          if (path !== 'userId') throw new Error('Incorrect first populate path');
          return {
            populate: jest.fn().mockImplementationOnce((path) => {
              if (path !== 'projectId') throw new Error('Incorrect second populate path');
              return {
                then: (callback) => callback(mockMember),
              };
            }),
          };
        }),
      }));

      // Mock GET API response
      const response = await request.get(`/api/projectteammembers/projectowner/${userId}`);

      // Tests
      expect(ProjectTeamMember.findOne).toHaveBeenCalledWith({ userId: userId });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);
      expect(response.body.vrmsProjectAdmin).toBe(true);

      // Marks completion of tests
    });

    it('should return a project team member that IS NOT a vrmsProjectAdmin based on userId with GET /api/projectteammembers/projectowner/:id', async () => {
      const mockMember = mockMembers[0];
      const userId = mockMember.userId;

      // Mock resolved value of ProjectTeamMember.findOne() method
      ProjectTeamMember.findOne.mockImplementation(() => ({
        populate: jest.fn().mockImplementationOnce((path) => {
          if (path !== 'userId') throw new Error('Incorrect first populate path');
          return {
            populate: jest.fn().mockImplementationOnce((path) => {
              if (path !== 'projectId') throw new Error('Incorrect second populate path');
              return {
                then: (callback) => callback(mockMember),
              };
            }),
          };
        }),
      }));

      // Mock GET API response
      const response = await request.get(`/api/projectteammembers/projectowner/${userId}`);

      // Tests
      expect(ProjectTeamMember.findOne).toHaveBeenCalledWith({ userId: userId });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(false);

      // Marks completion of tests
    });
  });

  describe('CREATE', () => {
    // New mock member
    const newMember = {
      id: 3,
      userId: '3',
      projectId: '3',
      teamMemberStatus: 'active',
      vrmsProjectAdmin: true,
      roleOnProject: 'UX',
      joinedDate: Date.now(),
      leftDate: Date.now(),
      leftReason: 'project completed',
      githubPermissionLevel: 'Read',
      onProjectGithub: true,
      onProjectGoogleDrive: true,
    };

    it('should create and return a new project team member with POST /api/projectteammember/', async () => {
      // Mock ProjectTeamMember.create() method
      ProjectTeamMember.create.mockResolvedValue(newMember);

      // Mock POST API response
      const response = await request.post('/api/projectteammembers/').send(newMember);

      // Tests
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newMember);

      // Marks completion of tests
    });
  });

  describe('UPDATE', () => {
    // Updated mock member
    const updatedMember = {
      id: '3',
      userId: '1',
      projectId: '2',
      teamMemberStatus: 'active',
      vrmsProjectAdmin: true,
      roleOnProject: 'Data Science',
      joinedDate: Date.now(),
      leftDate: Date.now(),
      leftReason: 'project paused',
      githubPermissionLevel: 'Triage',
      onProjectGithub: true,
      onProjectGoogleDrive: false,
    };
    const id = updatedMember.id;

    it('should update the updated project team member with PATCH /api/projectteammember/:id', async () => {
      // Mock ProjectTeamMember.create() method
      ProjectTeamMember.findByIdAndUpdate.mockResolvedValue(updatedMember);

      // Call PATCH API response
      const response = await request.patch(`/api/projectteammembers/${id}`).send(updatedMember);

      // Tests
      expect(ProjectTeamMember.findByIdAndUpdate).toHaveBeenCalledWith(id, updatedMember);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedMember);

      // Marks completion of tests
    });
  });
});
