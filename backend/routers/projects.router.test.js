const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const { setupDB } = require('../setup-test');
setupDB('api-projects');

const { Project } = require('../models');

beforeEach(async () => {});

describe('CREATE/READ', () => {
  test('Create and Read Event', async (done) => {
    // Test Data
    const submittedData = {
      name: 'projectName',
    };

    // Submit a project
    const res = await request
      .post('/api/projects/create')
      .set('Accept', 'application/json')
      .send(submittedData);
    expect(res.status).toBe(200);

    // Get all projects
    const res2 = await request.get('/api/projects/');
    // console.log(res2);
    expect(res2.status).not.toBe(404);

    const APIData = res2.body[0];
    expect(APIData.name === 'eventName');
    done();
  });
});

describe('READ', () => {});

describe('UPDATE', () => {});

describe('DELETE', () => {});
