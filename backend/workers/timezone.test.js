/**
 * Timezone / DST tests for event generation and checkin workers.
 *
 * These tests verify correct behavior when the server runs in UTC
 * but events are in America/Los_Angeles time. They cover:
 * - Day-of-week detection across timezone boundaries
 * - Event time generation preserving LA time-of-day
 * - DST spring-forward / fall-back transitions
 * - Checkin open/close window calculations
 *
 * Run with: TZ=UTC npx vitest run backend/workers/timezone.test.js
 *
 * Related: GitHub issue #1872, PR #2116
 */

import { describe, test, expect } from 'vitest';
import {
  getEventDay,
  generateEventFromRecurring,
  isInOpenWindow,
  isPastCloseWindow,
} from './lib/eventTime.js';

// -- The tests --

describe('Event day-of-week detection', () => {
  test('Tuesday 7pm PST event should be detected as Tuesday regardless of server timezone', () => {
    // Tuesday Jan 7, 2025 at 7pm PST = Wednesday Jan 8, 2025 at 3am UTC
    const tuesdayEventPST = {
      date: new Date('2025-01-08T03:00:00Z'), // 7pm PST Tuesday = 3am UTC Wednesday
    };

    const day = getEventDay(tuesdayEventPST);

    expect(day).toBe(2); // Tuesday
  });

  test('Monday 11pm PST event should be detected as Monday, not Tuesday', () => {
    // Monday Jan 6, 2025 at 11pm PST = Tuesday Jan 7, 2025 at 7am UTC
    const mondayLateEvent = {
      date: new Date('2025-01-07T07:00:00Z'), // 11pm PST Monday = 7am UTC Tuesday
    };

    const day = getEventDay(mondayLateEvent);

    expect(day).toBe(1); // Monday
  });

  test('event day should not change across DST spring-forward', () => {
    // Sunday March 9, 2025 at 7pm PST
    // Before spring forward: 7pm PST = UTC-8 = 3am UTC March 10
    const sundayEvent = {
      date: new Date('2025-03-10T03:00:00Z'), // 7pm PST Sunday March 9
    };

    const day = getEventDay(sundayEvent);

    expect(day).toBe(0); // Sunday
  });
});

describe('Event time generation', () => {
  test('7pm PST event should generate at 7pm LA time, not at UTC hour', () => {
    const today = new Date('2025-01-07T08:00:00Z'); // noon PST Tuesday
    const recurringEvent = {
      name: 'Tuesday Hacknight',
      date: new Date('2025-01-01T03:00:00Z'),     // 7pm PST = 3am UTC
      startTime: new Date('2025-01-01T03:00:00Z'),
      hours: 2,
    };

    const { newEventDate } = generateEventFromRecurring(recurringEvent, today);

    // The generated event should be at 7pm LA time
    const startHourLA = parseInt(
      newEventDate.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        hour12: false,
      }),
      10,
    );

    expect(startHourLA).toBe(19); // 7pm
  });

  test('11pm PST event should not jump to the next day', () => {
    const today = new Date('2025-01-07T08:00:00Z'); // noon PST Tuesday Jan 7
    const recurringEvent = {
      name: 'Late Night Event',
      date: new Date('2025-01-01T07:00:00Z'),     // 11pm PST = 7am UTC
      startTime: new Date('2025-01-01T07:00:00Z'),
      hours: 2,
    };

    const { newEventDate } = generateEventFromRecurring(recurringEvent, today);

    // Should be Jan 7 at 11pm LA time
    const dayLA = parseInt(
      newEventDate.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        day: 'numeric',
      }),
      10,
    );
    const hourLA = parseInt(
      newEventDate.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        hour12: false,
      }),
      10,
    );

    expect(dayLA).toBe(7);
    expect(hourLA).toBe(23); // 11pm
  });

  test('spring forward: 7pm event on March 9 should still be at 7pm PDT', () => {
    // March 9 is spring forward day (2am PST -> 3am PDT)
    // Recurring event stored at 7pm PST = 3am UTC
    // On March 9 after spring forward, 7pm PDT = 2am UTC March 10

    const marchNinth = new Date('2025-03-09T20:00:00Z'); // noon PDT
    const recurringEvent = {
      name: 'Weekly Hacknight',
      date: new Date('2025-03-02T03:00:00Z'),     // 7pm PST = 3am UTC
      startTime: new Date('2025-03-02T03:00:00Z'),
      hours: 2,
    };

    const { newEventDate } = generateEventFromRecurring(recurringEvent, marchNinth);

    const hourLA = parseInt(
      newEventDate.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        hour12: false,
      }),
      10,
    );

    expect(hourLA).toBe(19);
  });
});

describe('Checkin open/close window — DST transitions', () => {
  test('checkin should open 15min before a 7pm event on spring-forward day', () => {
    // March 9, 2025: spring forward
    // Event at 7pm PDT = 2am UTC March 10
    // "Now" is 6:45pm PDT March 9 = 1:45am UTC March 10

    // After Temporal fix: generateEventFromRecurring would produce 7pm PDT = 2am UTC
    // So eventDate should be 2am UTC March 10 for a correctly generated event
    const eventDate = new Date('2025-03-10T02:00:00Z'); // 7pm PDT March 9
    const nowReal = new Date('2025-03-10T01:45:00Z');   // 6:45pm PDT March 9

    const inWindow = isInOpenWindow(eventDate, nowReal);

    // 6:45pm is 15min before 7pm — should be in the 30-minute window
    expect(inWindow).toBe(true);
  });

  test('checkin should close 3hrs after a 7pm event on fall-back day', () => {
    // November 2, 2025: fall back (2am PDT -> 1am PST)
    // Event at 7pm PST (post-transition) = 3am UTC Nov 3
    // 3 hours after start = 10pm PST = 6am UTC Nov 3
    // "Now" is 10:05pm PST = 6:05am UTC Nov 3

    const eventDate = new Date('2025-11-03T03:00:00Z'); // 7pm PST
    const nowReal = new Date('2025-11-03T06:05:00Z');   // 10:05pm PST

    const shouldClose = isPastCloseWindow(eventDate, nowReal);

    expect(shouldClose).toBe(true);
  });
});
