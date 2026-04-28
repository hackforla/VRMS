import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import { CheckIn } from './checkIn.model.js';

import { setupDB } from '../setup-test.js';
setupDB("checkin-model");

describe("Checkin Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async () => {
    const submittedCheckinData = {
      userId: "1",
      eventId: "23",
      checkedIn: true,
      createdDate: 1594023390039,
    };

    await CheckIn.create(submittedCheckinData);
    const savedCheckinDataArray = await CheckIn.find();
    const savedCheckinData = savedCheckinDataArray[0];
    expect(savedCheckinData.userId).toBe(submittedCheckinData.userId);
    expect(savedCheckinData.eventId).toBe(submittedCheckinData.eventId);
    expect(savedCheckinData.createdDate.getTime()).toBe(submittedCheckinData.createdDate);
  });
});
