import { describe, it, expect, vi, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { User } from './user.model.js';

describe('Unit tests for User Model', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Serialization test', () => {
    it('should return the correct serialized user object', async () => {
      const userObj = {
        _id: new mongoose.Types.ObjectId(),
        name: { firstName: 'mock', lastName: 'user' },
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

      const mockUser = new User(userObj);
      const serializedUser = mockUser.serialize();

      expect(serializedUser).toEqual({
        id: mockUser._id,
        name: { firstName: mockUser.name.firstName, lastName: mockUser.name.lastName },
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
    it('should fail validation check if accessLevel is invalid', async () => {
      const mockuser = new User({ accessLevel: 'projectleader' });

      let error;
      try {
        await mockuser.validate();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.accessLevel).toBeDefined();
    });

    it('should enforce that emails are stored in lowercase', async () => {
      const uppercaseEmail = 'TEST@test.com';
      const mockUser = new User({ email: uppercaseEmail });

      mockUser.validate();
      expect(mockUser.email).toBe(uppercaseEmail.toLowerCase());
    });

    it('should pass validation with valid user data', async () => {
      const mockUser = new User({
        name: { firstName: 'Valid', lastName: 'User' },
        email: 'mockuser@gmail.com',
        accessLevel: 'user',
      });

      let error;
      try {
        await mockUser.validate();
      } catch (err) {
        error = err;
      }

      expect(error).toBeUndefined();
      expect(mockUser.email).toBe('mockuser@gmail.com');
      expect(mockUser.accessLevel).toBe('user');
      await expect(mockUser.validate()).resolves.toBeUndefined();
    });
  });
});
