// These are legacy integration tests that require a running database.
// They are skipped until a proper test database setup is in place.
// See: https://github.com/hackforla/VRMS/issues/2036
import { describe, test } from 'vitest';

describe.skip('CREATE', () => {
  test('Create a Project with POST to /api/projects/ without token', async () => {});
  test('Create a Project with POST to /api/projects/', async () => {});
});

describe.skip('READ', () => {
  test('Get all projects with GET to /api/projects/', async () => {});
});

describe.skip('UPDATE', () => {
  test('Update a project with PATCH to /api/projects/:id without a token', async () => {});
  test('Update a project with PATCH to /api/projects/:id with a token', async () => {});
});

describe.skip('DELETE', () => {
  test('Delete a project with POST to /api/projects/:id without a token', async () => {});
  test('Delete a project with POST to /api/projects/:id with a token', async () => {});
});
