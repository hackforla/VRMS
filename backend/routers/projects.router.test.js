import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';

vi.hoisted(() => {
  process.env.CUSTOM_REQUEST_HEADER = 'test-request-header';
});

import supertest from 'supertest';
import app from '../app.js';
const request = supertest(app);

import { setupDB } from '../setup-test.js';
setupDB('api-projects');

import { Project } from '../models/index.js';

const headers = {};
headers['x-customrequired-header'] = process.env.CUSTOM_REQUEST_HEADER;
headers.Accept = 'application/json';

describe('CREATE', () => {
  test('Create a Project with POST to /api/projects/', async () => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .send(submittedData);
    expect(res.status).toBe(201);
  });
});

describe('READ', () => {
  test('Get all projects with GET to /api/projects/', async () => {
      // Test Data
      const submittedData = {
        name: 'projectName',
      };

      // Submit a project
      const res = await request
        .post('/api/projects/')
        .set(headers)
        .send(submittedData);
      expect(res.status).toBe(201);

      // Get all projects
      const res2 = await request.get('/api/projects/').set(headers);
      expect(res2.status).toBe(200);

      const APIData = res2.body[0];
      expect(APIData.name).toBe(submittedData.name);
  });;
});

describe('UPDATE', () => {
  test('Update a project with PATCH to /api/projects/:id', async () => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .send(submittedData);
    expect(res.status).toBe(201);

    const updatedDataPayload = {
      name: 'updatedProjectName',
    };

    // Update project
    const res2 = await request
      .patch(`/api/projects/${res.body._id}`)
      .set(headers)
      .send(updatedDataPayload);
    expect(res2.status).toBe(200);

    // Get project
    const res3 = await request.get(`/api/projects/${res.body._id}`).set(headers);
    expect(res3.status).toBe(200);

    const APIData = res3.body;
    expect(APIData.name).toBe(updatedDataPayload.name);
  });
});

describe('DELETE', () => {
  test('Delete a project with POST to /api/projects/:id', async () => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .send(submittedData);
    expect(res.status).toBe(201);

    // Delete project
    const res2 = await request.patch(`/api/projects/${res.body._id}`).set(headers);
    expect(res2.status).toBe(200);
});
});
