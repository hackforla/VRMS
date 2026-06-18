/**
 * End-to-end timezone pipeline integration tests.
 *
 * Wires the extracted pure-data ops (`recurringEventOps`, `checkinOps`) to
 * the real Mongoose models against an in-memory MongoDB, and asserts the
 * full path from a stored RecurringEvent → filter → buildNewEvent → save
 * Event → open-window filter behaves correctly across timezone and DST
 * boundaries.
 *
 * These are the regression guard for GitHub issue #1872 at the
 * pipeline level (vs. the unit-level guard in `../timezone.test.js`).
 *
 * Run with: bunx vitest run workers/integration/timezone-pipeline.test.js
 */

import { describe, test, expect, beforeAll, afterEach, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { RecurringEvent } from '../../models/recurringEvent.model.js';
import { Event } from '../../models/event.model.js';
import {
  filterTodaysRecurringEvents,
  buildNewEvent,
  isEventDuplicate,
} from '../lib/recurringEventOps.js';
import { filterEventsInOpenWindow } from '../lib/checkinOps.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}, 60000);

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

/**
 * Convenience: extract the wall-clock hour of a JS Date in America/Los_Angeles.
 */
function hourInLA(date) {
  return parseInt(
    date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      hour12: false,
    }),
    10,
  );
}

describe('timezone pipeline — core: Tuesday 7pm PST event', () => {
  test('recurring → filter → build → save → open-window all behave correctly', async () => {
    // 7pm PST Tuesday Jan 7 2025 = 3am UTC Wednesday Jan 8
    const recurring = await RecurringEvent.create({
      name: 'Tuesday Hacknight',
      hacknight: 'DTLA',
      eventType: 'Project Meeting',
      description: 'Weekly project meeting',
      date: new Date('2025-01-08T03:00:00Z'),
      startTime: new Date('2025-01-08T03:00:00Z'),
      endTime: new Date('2025-01-08T05:00:00Z'),
      hours: 2,
    });

    // Noon PST Tuesday Jan 7 2025 (= 8pm UTC Jan 7)
    const todayDate = new Date('2025-01-07T20:00:00Z');

    // Day filter must include this recurring event (LA Tuesday matches LA Tuesday)
    const filtered = await filterTodaysRecurringEvents([recurring], todayDate);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]._id.toString()).toBe(recurring._id.toString());

    // Build new event payload from the recurring template
    const payload = await buildNewEvent(filtered[0], todayDate);
    expect(payload.name).toBe('Tuesday Hacknight');
    expect(payload.hours).toBe(2);
    expect(payload.date).toBeInstanceOf(Date);

    // Persist as a real Event
    const savedEvent = await Event.create(payload);

    // 7pm PST in LA wall-clock
    expect(hourInLA(savedEvent.date)).toBe(19);
    // 3am UTC — proves we're storing the correct instant
    // (old getDay()-based bug would have produced a noon-UTC date here)
    expect(savedEvent.date.getUTCHours()).toBe(3);

    // Checkin window opens at 6:45pm PST = 2:45am UTC Jan 8
    const beforeOpen = new Date('2025-01-08T02:45:00Z');
    const openNow = await filterEventsInOpenWindow([savedEvent], beforeOpen);
    expect(openNow).toHaveLength(1);
    expect(openNow[0]._id.toString()).toBe(savedEvent._id.toString());

    // 8pm PST = 4am UTC Jan 8 — well past the 30-minute open window
    const afterOpen = new Date('2025-01-08T04:00:00Z');
    const stillOpen = await filterEventsInOpenWindow([savedEvent], afterOpen);
    expect(stillOpen).toEqual([]);
  });
});

describe('timezone pipeline — day filter: Wednesday UTC, Tuesday LA', () => {
  test('LA-Wednesday todayDate must NOT match a 7pm-PST Tuesday recurring event', async () => {
    // 7pm PST Tuesday Jan 7 2025 = 3am UTC Wednesday Jan 8
    const recurring = await RecurringEvent.create({
      name: 'Tuesday Hacknight',
      hacknight: 'DTLA',
      eventType: 'Project Meeting',
      date: new Date('2025-01-08T03:00:00Z'),
      startTime: new Date('2025-01-08T03:00:00Z'),
      endTime: new Date('2025-01-08T05:00:00Z'),
      hours: 2,
    });

    // 2am PST Wednesday Jan 8 = 10am UTC Wednesday Jan 8 — genuinely Wednesday in LA
    const todayDate = new Date('2025-01-08T10:00:00Z');

    const filtered = await filterTodaysRecurringEvents([recurring], todayDate);
    expect(filtered).toEqual([]);
  });
});

describe('timezone pipeline — DST spring-forward', () => {
  test('event stored at 7pm PST generates at 7pm PDT after spring-forward', async () => {
    // Recurring event stored during PST: 7pm PST Sunday Mar 2 2025
    // PST is UTC-8, so 7pm PST Sunday Mar 2 = 3am UTC Monday Mar 3.
    // (Note: the task spec's literal '2025-03-02T03:00:00Z' is 7pm PST
    // Saturday Mar 1 — the spec date is off by 24h vs. its description of
    // "7pm PST Sunday". Using the correctly-encoded Sunday instant here so
    // the day filter exercises the intended path.)
    const recurring = await RecurringEvent.create({
      name: 'Sunday Stand-up',
      hacknight: 'Online',
      eventType: 'Project Meeting',
      date: new Date('2025-03-03T03:00:00Z'),
      startTime: new Date('2025-03-03T03:00:00Z'),
      endTime: new Date('2025-03-03T04:00:00Z'),
      hours: 1,
    });

    // 1pm PDT Sunday Mar 9 2025 = 20:00 UTC. After spring-forward, PDT = UTC-7.
    const todayDate = new Date('2025-03-09T20:00:00Z');

    const filtered = await filterTodaysRecurringEvents([recurring], todayDate);
    expect(filtered).toHaveLength(1);

    const payload = await buildNewEvent(filtered[0], todayDate);
    const savedEvent = await Event.create(payload);

    // 7pm in LA wall-clock — DST preserved
    expect(hourInLA(savedEvent.date)).toBe(19);
    // 7pm PDT = UTC-7 = 2am UTC the following day
    expect(savedEvent.date.getUTCHours()).toBe(2);
  });
});

describe('timezone pipeline — duplicate detection', () => {
  test('isEventDuplicate detects an existing event on the same LA day', async () => {
    const todayDate = new Date('2025-01-07T20:00:00Z'); // noon PST Tuesday Jan 7
    const eventName = 'Tuesday Hacknight';

    // Seed the recurring template — saved so we can pass it as the first arg.
    const recurringTemplate = await RecurringEvent.create({
      name: eventName,
      hacknight: 'DTLA',
      eventType: 'Project Meeting',
      date: new Date('2025-01-08T03:00:00Z'),
      startTime: new Date('2025-01-08T03:00:00Z'),
      endTime: new Date('2025-01-08T05:00:00Z'),
      hours: 2,
    });

    // Existing event already created today at 7pm PST = 3am UTC Jan 8.
    // No recurringEventLink set → isEventDuplicate falls back to name+day match.
    const existing = await Event.create({
      name: eventName,
      hacknight: 'DTLA',
      eventType: 'Project Meeting',
      date: new Date('2025-01-08T03:00:00Z'),
      startTime: new Date('2025-01-08T03:00:00Z'),
      endTime: new Date('2025-01-08T05:00:00Z'),
      hours: 2,
    });

    expect(isEventDuplicate(recurringTemplate, [existing], todayDate)).toBe(true);

    // Sanity: an unrelated name on the same day is NOT a duplicate
    expect(isEventDuplicate({ name: 'Other Event' }, [existing], todayDate)).toBe(false);

    // Sanity: same name but a different LA day is NOT a duplicate
    const differentDay = new Date('2025-01-09T20:00:00Z'); // Wednesday LA
    expect(isEventDuplicate(recurringTemplate, [existing], differentDay)).toBe(false);
  });
});
