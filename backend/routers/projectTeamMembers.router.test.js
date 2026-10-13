import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../models/projectTeamMember.model.js');

import { ProjectTeamMember } from '../models/index.js';
import ProjectTeamRouter from './projectTeamMembers.router.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use(express.json());
testapp.use('/api/projectteammembers', ProjectTeamRouter);
const request = supertest(testapp);

describe('Unit testing for project team members router', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('READ', () => {
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
      ProjectTeamMember.find.mockReturnValue({
        populate: vi.fn((path) => {
          if (path !== 'userId') throw new Error('Incorrect populate path');
          return {
            then: (callBack) => callBack(mockMembers),
          };
        }),
      });

      const response = await request.get('/api/projectteammembers');

      expect(ProjectTeamMember.find().populate).toHaveBeenCalledWith('userId');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMembers);
    });

    it('should return a single project team member based on projectId with GET /api/projectteammembers/:id', async () => {
      const mockMember = mockMembers[0];
      const projectId = mockMember.projectId;

      ProjectTeamMember.find.mockReturnValue({
        populate: vi.fn((path) => {
          if (path !== 'userId') throw new Error('Incorrect populate path');
          return {
            then: (callBack) => callBack(mockMember),
          };
        }),
      });

      const response = await request.get(`/api/projectteammembers/${projectId}`);

      expect(ProjectTeamMember.find).toHaveBeenCalledWith({ projectId: projectId });
      expect(ProjectTeamMember.find().populate).toHaveBeenCalledWith('userId');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);
    });

    it('should return a specific project team member based on projectId and userId with GET /api/projectteammembers/project/:id/:userId', async () => {
      const mockMember = mockMembers[1];
      const projectId = mockMember.projectId;
      const userId = mockMember.userId;

      ProjectTeamMember.find.mockReturnValue({
        populate: vi.fn((path) => {
          if (path !== 'userId') throw new Error('Incorrect populate path');
          return {
            then: (callBack) => callBack(mockMember),
          };
        }),
      });

      const response = await request.get(`/api/projectteammembers/project/${projectId}/${userId}`);

      expect(ProjectTeamMember.find).toHaveBeenCalledWith({ projectId: projectId, userId: userId });
      expect(ProjectTeamMember.find().populate).toHaveBeenCalledWith('userId');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);
    });

    it('should return a specific project owner that IS an vrmsProjectAdmin on userId with GET /api/projectteammembers/projectowner/:id', async () => {
      const mockMember = mockMembers[1];
      const userId = mockMember.userId;

      ProjectTeamMember.findOne.mockImplementation(() => ({
        populate: vi.fn().mockImplementationOnce((path) => {
          if (path !== 'userId') throw new Error('Incorrect first populate path');
          return {
            populate: vi.fn().mockImplementationOnce((path) => {
              if (path !== 'projectId') throw new Error('Incorrect second populate path');
              return {
                then: (callback) => callback(mockMember),
              };
            }),
          };
        }),
      }));

      const response = await request.get(`/api/projectteammembers/projectowner/${userId}`);

      expect(ProjectTeamMember.findOne).toHaveBeenCalledWith({ userId: userId });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMember);
      expect(response.body.vrmsProjectAdmin).toBe(true);
    });

    it('should return a project team member that IS NOT a vrmsProjectAdmin based on userId with GET /api/projectteammembers/projectowner/:id', async () => {
      const mockMember = mockMembers[0];
      const userId = mockMember.userId;

      ProjectTeamMember.findOne.mockImplementation(() => ({
        populate: vi.fn().mockImplementationOnce((path) => {
          if (path !== 'userId') throw new Error('Incorrect first populate path');
          return {
            populate: vi.fn().mockImplementationOnce((path) => {
              if (path !== 'projectId') throw new Error('Incorrect second populate path');
              return {
                then: (callback) => callback(mockMember),
              };
            }),
          };
        }),
      }));

      const response = await request.get(`/api/projectteammembers/projectowner/${userId}`);

      expect(ProjectTeamMember.findOne).toHaveBeenCalledWith({ userId: userId });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(false);
    });
  });

  describe('CREATE', () => {
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
      ProjectTeamMember.create.mockResolvedValue(newMember);

      const response = await request.post('/api/projectteammembers/').send(newMember);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newMember);
    });
  });

  describe('UPDATE', () => {
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
      ProjectTeamMember.findByIdAndUpdate.mockResolvedValue(updatedMember);

      const response = await request.patch(`/api/projectteammembers/${id}`).send(updatedMember);

      expect(ProjectTeamMember.findByIdAndUpdate).toHaveBeenCalledWith(id, updatedMember);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedMember);
    });
  });
});
