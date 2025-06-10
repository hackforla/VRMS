const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const jwt = require('jsonwebtoken');
const { CONFIG_AUTH } = require('../config');


const { setupDB } = require('../setup-test');
setupDB('api-projects');

const { Project, User } = require('../models');
const CONFIG = require('../config/auth.config');

const headers = {};
headers['x-customrequired-header'] = CONFIG.CUSTOM_REQUEST_HEADER;
headers.Accept = 'application/json';
headers.authorization = 'Bearer sometoken';

let token;


describe('CREATE', () => {
  beforeAll( async () => {
    const submittedData = {
      name: {
        firstName: 'test',
        lastName: 'user',
      },
      email: 'newtest@test.com',
    };
    const user = await User.create(submittedData);
    const auth_origin = 'TEST';
    token = jwt.sign(
      { id: user.id, role: user.accessLevel, auth_origin },
      CONFIG_AUTH.SECRET,
      {
        expiresIn: `${CONFIG_AUTH.TOKEN_EXPIRATION_SEC}s`,
      },
    );
  })
  test('Create a Project with POST to /api/projects/ without token', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .send(submittedData);
    expect(res.status).toBe(401);
    done();
  });

  test('Create a Project with POST to /api/projects/', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .set('Cookie', [`token=${token}`] )
      .send(submittedData);
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
      const res = await request
        .post('/api/projects/')
        .set(headers)
        .set('Cookie', [`token=${token}`])
        .send(submittedData);
      expect(res.status).toBe(201);

      // Get all projects
      const res2 = await request.get('/api/projects/').set(headers);
      expect(res2.status).toBe(200);

      const APIData = res2.body[0];
      expect(APIData.name).toBe(submittedData.name);
      done();
  });;
});

describe('UPDATE', () => {
  beforeAll(async () => {
    const submittedData = {
      name: {
        firstName: 'test',
        lastName: 'user',
      },
      email: 'newtest@test.com',
    };
    const user = await User.create(submittedData);
    const auth_origin = 'TEST';
    token = jwt.sign(
      { id: user.id, role: user.accessLevel, auth_origin },
      CONFIG_AUTH.SECRET,
      {
        expiresIn: `${CONFIG_AUTH.TOKEN_EXPIRATION_SEC}s`,
      },
    );
  })
  test('Update a project with PATCH to /api/projects/:id without a token', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .set('Cookie', [`token=${token}`])
      .send(submittedData);
    expect(res.status).toBe(201);

    const updatedDataPayload = {
      name: 'updatedProjectName',
    };

    // Update project
    const res2 = await request
      .put(`/api/projects/${res.body._id}`)
      .set(headers)
      .send(updatedDataPayload);
    expect(res2.status).toBe(401);

    // Get project
    const res3 = await request.get(`/api/projects/${res.body._id}`)
    .set(headers);
    expect(res3.status).toBe(200);
    done();
  });
  test('Update a project with PATCH to /api/projects/:id with a token', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .set('Cookie', [`token=${token}`])
      .send(submittedData);
    expect(res.status).toBe(201);

    const updatedDataPayload = {
      name: 'updatedProjectName',
    };

    // Update project
    const res2 = await request
      .put(`/api/projects/${res.body._id}`)
      .set(headers)
      .set('Cookie', [`token=${token}`])
      .send(updatedDataPayload);
    expect(res2.status).toBe(200)

    // Get project
    const res3 = await request.get(`/api/projects/${res.body._id}`)
    .set(headers)
    .set('Cookie', [`token=${token}`])
    expect(res3.status).toBe(200);

    const APIData = res3.body;
    expect(APIData.name).toBe(updatedDataPayload.name);
    done();
  });
});

describe('DELETE', () => {
  beforeAll(async () => {
    const submittedData = {
      name: {
        firstName: 'test',
        lastName: 'user',
      },
      email: 'newtest@test.com',
    };
    const user = await User.create(submittedData);
    const auth_origin = 'TEST';
    token = jwt.sign(
      { id: user.id, role: user.accessLevel, auth_origin },
      CONFIG_AUTH.SECRET,
      {
        expiresIn: `${CONFIG_AUTH.TOKEN_EXPIRATION_SEC}s`,
      },
    );
  })
  test('Delete a project with POST to /api/projects/:id without a token', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .set('Cookie', [`token=${token}`])
      .send(submittedData);
    expect(res.status).toBe(201);

    // Delete project
    const res2 = await request.patch(`/api/projects/${res.body._id}`)
    .set(headers);
    expect(res2.status).toBe(401);
    done();
});
  test('Delete a project with POST to /api/projects/:id with a token', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/')
      .set(headers)
      .set('Cookie', [`token=${token}`])
      .send(submittedData);
    expect(res.status).toBe(201);

    // Delete project
    const res2 = await request.patch(`/api/projects/${res.body._id}`)
    .set(headers)
    .set('Cookie', [`token=${token}`])
    expect(res2.status).toBe(200);
    done();
});
});
