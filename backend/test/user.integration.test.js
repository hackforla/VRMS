const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const { setupIntegrationDB } = require('../setup-test');
setupIntegrationDB('api-users');

const backendHeaders = process.env.CUSTOM_REQUEST_HEADER;

const submittedData = {
  name: {
    firstName: 'test',
    lastName: 'user',
  },
  email: 'newtest@test.com',
};
var createdUserId = '';

// @TODO: Fix failing test, require investigation. Please referece issue 2036
describe.skip('CREATE', () => {
  test('Create a User with POST to /api/users/', async () => {
    // Submit a User
    const res = await request
      .post('/api/users/')
      .set('Accept', 'application/json')
      .set('x-customrequired-header', backendHeaders)
      .send(submittedData);
    expect(res.status).toBe(201);
    expect(res.body.name).toMatchObject(submittedData.name);

    createdUserId = res.body._id;

  });

  test('Fail when creating a User with duplicate email', async () => {
    // Submit a User
    const res = await request
      .post('/api/users/')
      .set('Accept', 'application/json')
      .set('x-customrequired-header', backendHeaders)
      .send(submittedData);
    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({
      error: { code: 11000, driver: true, name: 'MongoError', index: 0 },
      message: 'User already exists',
    });

  });
});

// @TODO: Fix failing test, require investigation. Please referece issue 2036
describe.skip('READ', () => {
  test('Get a list of Users with with GET to /api/users/', async () => {
    // Get all Users
    const res = await request.get('/api/users/').set('x-customrequired-header', backendHeaders);
    expect(res.status).toBe(200);

    const APIData = res.body[0];
    expect(APIData.name).toMatchObject(submittedData.name);

  });
  test('Get a specific User by param with GET to /api/users?email=<query>', async () => {
    // Get User by query of email
    const res = await request
      .get('/api/users?email=newtest@test.com')
      .set('x-customrequired-header', backendHeaders);
    expect(res.status).toBe(200);

    const APIData = res.body[0];
    expect(APIData.name).toMatchObject(submittedData.name);

  });

  test('Get a specific User by UserId with GET to /api/users/:UserId', async () => {
    // Get User by UserId
    const res = await request
      .get(`/api/users/${createdUserId}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res.status).toBe(200);

    const APIData = res.body;
    expect(APIData.email).toBe(submittedData.email);
    expect(APIData.name).toMatchObject(submittedData.name);

  });
});

// @TODO: Fix failing test, require investigation. Please referece issue 2036
describe.skip('UPDATE', () => {
  test('Update a User with PATCH to /api/users/:UserId', async () => {
    const updatedEmail = {
      email: 'newtest2@test.com',
    };

    // Update User
    const resUpdate = await request
      .patch(`/api/users/${createdUserId}`)
      .set('Accept', 'application/json')
      .set('x-customrequired-header', backendHeaders)
      .send(updatedEmail);
    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.name).toMatchObject(submittedData.name);

    const res2 = await request
      .get(`/api/users/${createdUserId}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res2.status).toBe(200);

    const APIData = res2.body;
    expect(APIData.email).toBe(updatedEmail.email);
    expect(APIData.name).toMatchObject(submittedData.name);

  });
});

// @TODO: Fix failing test, require investigation. Please referece issue 2036
describe.skip('DELETE', () => {
  test('Delete a specific user by Id with DELETE /api/users/:UserId', async () => {
    // Delete User
    const res = await request
      .delete(`/api/users/${createdUserId}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res.status).toBe(200);

    const APIData = res.body;
    expect(APIData.name).toMatchObject(submittedData.name);

    // Check to see that deleted User is gone
    const res2 = await request
      .get(`/api/users/${createdUserId}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res2.body).toEqual({});

  });
});
