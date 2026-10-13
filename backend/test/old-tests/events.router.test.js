// These are legacy integration tests that require a running database.
// They are skipped until a proper test database setup is in place.
// See: https://github.com/hackforla/VRMS/issues/2036
import { describe, test, expect } from 'vitest';

describe.skip('CREATE', () => {
  test('Create Event', async () => {});
});

describe.skip('READ', () => {
  test('GET Events list', async () => {});
  test('GET Event by ID', async () => {});
});

describe.skip('UPDATE', () => {
  test('Update Event by ID with PATCH', async () => {});
});

describe.skip('DELETE', () => {
  test('Delete Event by ID with DELETE', async () => {});
});
