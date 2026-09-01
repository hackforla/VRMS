import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import mongoose from 'mongoose';
import { User } from './user.model.js';
import { setupIntegrationDB } from '../setup-test.js';

setupIntegrationDB('user-model');

describe('User Model - Create and Read', () => {
  test('Save a model instance and then read from the db', async () => {
    const submittedData = {
      name: {
        firstName: 'Test',
        lastName: 'User',
      },
      email: 'test@test.com',
      accessLevel: 'user',
      createdDate: 1594023390039,
      currentRole: 'mage',
      desiredRole: 'warlock',
      newMember: true,
      currentJobTitle: 'freehand artist',
      desiredJobTitle: 'textile factory worker',
      skillsToMatch: ['marketing assistant'],
      firstAttended: 'year 0',
      attendanceReason: 'training',
      phone: '867-5309',
      textingOk: true,
      slackName: 'slacktestuser',
    };

    await User.create(submittedData);
    const savedData = await User.findOne({ email: submittedData.email });
    expect(savedData.name.firstName).toBe(submittedData.name.firstName);
    expect(savedData.currentRole).toBe(submittedData.currentRole);
    expect(savedData.desiredJobTitle).toBe(submittedData.desiredJobTitle);
  });

  test('Create a simple user', async () => {
    const submittedData = {
      name: {
        firstName: 'Simple',
        lastName: 'User',
      },
      email: 'simple@test.com',
    };

    await User.create(submittedData);
    const savedData = await User.findOne({ email: submittedData.email });
    expect(savedData.name.firstName).toBe(submittedData.name.firstName);
    expect(savedData.email).toBe(submittedData.email);
  });
});

describe('User Model - Serialization', () => {
  test('should serialize user data correctly', async () => {
    const userData = {
      name: { firstName: 'Serialize', lastName: 'Test' },
      email: 'serialize.test@example.com',
      accessLevel: 'admin',
      currentRole: 'Backend Developer',
      desiredRole: 'Lead Developer',
      newMember: false,
      currentJobTitle: 'Actual Current Job Title',
      desiredJobTitle: 'Actual Desired Job Title',
      skillsToMatch: ['JavaScript', 'MongoDB'],
      phone: '555-0101',
      textingOk: true,
      slackName: 'serializeslack',
      isHflaGithubMember: true,
      githubPublic2FA: false,
      availability: 'Evenings',
      managedProjects: ['ProjectGamma'],
      isActive: true,
      createdDate: new Date(2023, 0, 15),
    };

    const user = await User.create(userData);
    const serializedUser = user.serialize();

    expect(serializedUser.id.toString()).toBe(user._id.toString());
    expect(serializedUser.name.firstName).toBe(userData.name.firstName);
    expect(serializedUser.name.lastName).toBe(userData.name.lastName);
    expect(serializedUser.email).toBe(userData.email);
    expect(serializedUser.accessLevel).toBe(userData.accessLevel);
    expect(serializedUser.createdDate).toEqual(userData.createdDate);
    expect(serializedUser.currentRole).toBe(userData.currentRole);
    expect(serializedUser.desiredRole).toBe(userData.desiredRole);
    expect(serializedUser.newMember).toBe(userData.newMember);
    expect([...serializedUser.skillsToMatch]).toEqual(userData.skillsToMatch);
    expect(serializedUser.phone).toBe(userData.phone);
    expect(serializedUser.textingOk).toBe(userData.textingOk);
    expect(serializedUser.slackName).toBe(userData.slackName);
    expect(serializedUser.isHflaGithubMember).toBe(userData.isHflaGithubMember);
    expect(serializedUser.githubPublic2FA).toBe(userData.githubPublic2FA);
    expect(serializedUser.availability).toBe(userData.availability);
    expect([...serializedUser.managedProjects]).toEqual(userData.managedProjects);
    expect(serializedUser.isActive).toBe(userData.isActive);
  });
});

describe('User Model - Validation', () => {
  test('should fail if email is not unique', async () => {
    const email = 'unique.validation@example.com';
    await User.create({
      name: { firstName: 'First', lastName: 'User' },
      email: email,
      accessLevel: 'user',
    });

    await expect(
      User.create({
        name: { firstName: 'Second', lastName: 'User' },
        email: email,
        accessLevel: 'user',
      }),
    ).rejects.toMatchObject({ code: 11000 });
  });

  test('should fail if accessLevel is not in enum', async () => {
    const userData = {
      name: { firstName: 'Enum', lastName: 'Test' },
      email: 'enum.test@example.com',
      accessLevel: 'invalid_access_level',
    };

    const user = new User(userData);
    await expect(user.save()).rejects.toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
