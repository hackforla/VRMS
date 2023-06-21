const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const { setupDB } = require('../setup-test');
setupDB('api-projects');

const { Project } = require('../models');
const CONFIG = require('../config/auth.config');

const headers = {};
headers['x-customrequired-header'] = CONFIG.CUSTOM_REQUEST_HEADER;
headers.Accept = 'application/json';

describe('CREATE', () => {
  test('Create a Project with POST to /api/projects/', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request.post('/api/projects/').set(headers).send(submittedData);
    expect(res.status).toBe(201);
    done();
  });
});

describe('READ', () => {
  test('Get all projects with GET to /api/projects/', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request.post('/api/projects/').set(headers).send(submittedData);
    expect(res.status).toBe(201);

    // Get all projects
    const res2 = await request.get('/api/projects/').set(headers);
    expect(res2.status).toBe(200);

    const APIData = res2.body[0];
    expect(APIData.name).toBe(submittedData.name);
    done();
  });
});

describe('UPDATE', () => {
  test('Update a project with PATCH to /api/projects/:id', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request.post('/api/projects/').set(headers).send(submittedData);
    expect(res.status).toBe(201);

    const updatedDataPayload = {
      name: 'updatedProjectName',
    };

    // Update project
    const res2 = await request
      .put(`/api/projects/${res.body._id}`)
      .set(headers)
      .send(updatedDataPayload);
    expect(res2.status).toBe(200);

    // Get project
    const res3 = await request.get(`/api/projects/${res.body._id}`).set(headers);
    expect(res3.status).toBe(200);

    const APIData = res3.body;
    expect(APIData.name).toBe(updatedDataPayload.name);
    done();
  });
});

describe('DELETE', () => {
  test('Delete a project with POST to /api/projects/:id', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request.post('/api/projects/').set(headers).send(submittedData);
    expect(res.status).toBe(201);

    // Delete project
    const res2 = await request.patch(`/api/projects/${res.body._id}`).set(headers);
    expect(res2.status).toBe(200);
    done();
  });
});
