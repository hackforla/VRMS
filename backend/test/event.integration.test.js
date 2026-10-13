import { describe, test, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import app from '../app.js';
import { Event } from '../models/index.js';
import { setupIntegrationDB } from '../setup-test.js';

setupIntegrationDB('api-events');

const request = supertest(app);
const backendHeaders = process.env.CUSTOM_REQUEST_HEADER;

describe('GET /api/events', () => {
  beforeAll(async () => {
    await Event.create([
      { name: 'Past Event', date: new Date('2020-01-01T00:00:00Z') },
      { name: 'Future Event', date: new Date('2099-01-01T00:00:00Z') },
    ]);
  });

  test('filters events with a bracket-style date[$gt] query', async () => {
    const res = await request
      .get(`/api/events/?date[$gt]=${new Date('2025-01-01T00:00:00Z').toISOString()}`)
      .set('x-customrequired-header', backendHeaders);

    expect(res.status).toBe(200);
    expect(res.body.map((event) => event.name)).toEqual(['Future Event']);
  });
});
