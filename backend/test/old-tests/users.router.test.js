// These are legacy integration tests that require a running database.
// They are skipped until a proper test database setup is in place.
// See: https://github.com/hackforla/VRMS/issues/2036
import { describe, test } from 'vitest';

describe.skip('CREATE', () => {
  test('Create a User with POST to /api/users/', async () => {});
});

describe.skip('READ', () => {
  test('Get a list of Users with with GET to /api/users/', async () => {});
  test('Get a specific User by param with GET to /api/users?email=<query>', async () => {});
  test('Get a specific User by UserId with GET to /api/users/:UserId', async () => {});
});

describe.skip('UPDATE', () => {
  test('Update a User with PATCH to /api/users/:UserId', async () => {});
});

describe.skip('DELETE', () => {
  test('Delete a specific user by Id with DELETE /api/users/:UserId', async () => {});
});
