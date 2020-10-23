const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const { setupDB } = require('../setup-test');
setupDB('api-users');

describe('CREATE', () => {
  const backendHeaders = process.env.CUSTOM_REQUEST_HEADER;
  test('Create a User with POST to /api/users/', async (done) => {
    // Test Data
    const submittedData = {
      name: {
        firstName: 'test',
        lastName: 'user',
      },
      email: 'newtest@test.com',
    };

    // Submit a User
    const res = await request
      .post('/api/users/')
      .set('Accept', 'application/json')
      .set('x-customrequired-header', backendHeaders)
      .send(submittedData);
    expect(res.status).toBe(201);

    done();
  });
});

describe('READ', () => {
  test('Get a list of Users with with GET to /api/users/', async (done) => {
    expect(1).toBe(2);
    done();
  });
  test('Get a Users with with GET to /api/users/:UserId', async (done) => {
    expect(1).toBe(2);
    done();
  });
});

describe('UPDATE', () => {
  test('Update a User with PATCH to /api/users/:UserId', async (done) => {
    expect(1).toBe(2);
    done();
  });
});

describe('DELETE', () => {
  test('Delete a User with DELETE to /api/users/:UserId', async (done) => {
    expect(1).toBe(2);
    done();
  });
});
