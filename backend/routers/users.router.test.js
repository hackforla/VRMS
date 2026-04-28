import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';

vi.hoisted(() => {
  process.env.CUSTOM_REQUEST_HEADER = 'test-request-header';
});

import supertest from 'supertest';
import app from '../app.js';
const request = supertest(app);

import { setupDB } from '../setup-test.js';
setupDB('api-users');

const backendHeaders = process.env.CUSTOM_REQUEST_HEADER;
describe('CREATE', () => {
  test('Create a User with POST to /api/users/', async () => {
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

  });
});

describe('READ', () => {
  test('Get a list of Users with with GET to /api/users/', async () => {
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

    // Get all Users
    const res2 = await request.get('/api/users/').set('x-customrequired-header', backendHeaders);
    expect(res2.status).toBe(200);

    const APIData = res2.body[0];
    expect(APIData.name).toMatchObject(submittedData.name);

  });
  test('Get a specific User by param with GET to /api/users?email=<query>', async () => {
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

    // Get all Users
    const res2 = await request
      .get('/api/users?email=newtest@test.com')
      .set('x-customrequired-header', backendHeaders);
    expect(res2.status).toBe(200);

    const APIData = res2.body[0];
    expect(APIData.name).toMatchObject(submittedData.name);

  });

  test('Get a specific User by UserId with GET to /api/users/:UserId', async () => {
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

    // Get User by UserId
    const res2 = await request
      .get(`/api/users/${res.body._id}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res2.status).toBe(200);

    const APIData = res2.body;
    expect(APIData.email).toBe(submittedData.email);
    expect(APIData.name).toMatchObject(submittedData.name);

  });
});

describe('UPDATE', () => {
  test('Update a User with PATCH to /api/users/:UserId', async () => {
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

    const updatedEmail = {
      email: 'newtest@test.com',
    };

    // Update User
    const resUpdate = await request
      .patch(`/api/users/${res.body._id}`)
      .set('Accept', 'application/json')
      .set('x-customrequired-header', backendHeaders)
      .send(updatedEmail);
    expect(resUpdate.status).toBe(200);
    // TODO: The updated User call is not returning a repsonse. Uncomment below line and
    // run to see.
    // expect(resUpdate.name).toMatchObject(submittedData.name);

    const res2 = await request
      .get(`/api/users/${res.body._id}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res2.status).toBe(200);

    const APIData = res2.body;
    expect(APIData.email).toBe(updatedEmail.email);
    expect(APIData.name).toMatchObject(submittedData.name);

  });
});

describe('DELETE', () => {
  test('Delete a specific user by Id with DELETE /api/users/:UserId', async () => {
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

    // Delete User
    const res2 = await request
      .delete(`/api/users/${res.body._id}`)
      .set('x-customrequired-header', backendHeaders);
    expect(res2.status).toBe(200);

    const APIData = res2.body;
    expect(APIData.name).toMatchObject(submittedData.name);

  });
});
