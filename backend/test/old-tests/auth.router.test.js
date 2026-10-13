// These are legacy integration tests that require a running database.
// They are skipped until a proper test database setup is in place.
// See: https://github.com/hackforla/VRMS/issues/2036
import { describe, test } from 'vitest';

describe.skip('CREATE User', () => {
  test('Create user with POST to /users', async () => {});
  test('Create user with POST to /auth/signup', async () => {});
});

describe.skip('SIGNUP Validation', () => {
  test('Invalid data to /api/auth/signup returns 403', async () => {});
  test('Existing user returns 400', async () => {});
});

describe.skip('SIGNIN User', () => {
  test('User can signin and returns 200', async () => {});
});

describe.skip('SIGNIN Validation', () => {
  test('Non admin user returns 401', async () => {});
  test('A non-valid email return 403', async () => {});
});
