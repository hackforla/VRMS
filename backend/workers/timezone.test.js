/**
 * RED TESTS: Timezone / DST bugs in event generation and checkin workers.
 *
 * These tests document known failures in how the system handles
 * Pacific time and DST transitions. They are intentionally RED —
 * they describe correct behavior that the current code does NOT produce.
 *
 * The core problem: recurring events store date/startTime as Date objects.
 * The workers use getDay(), getHours(), getMinutes() which return values
 * in the SERVER's timezone, not LA time. If the server runs in UTC,
 * a Tuesday 7pm PST event (stored as Wednesday 3am UTC) gets getDay()=3
 * (Wednesday) instead of getDay()=2 (Tuesday).
 *
 * Related: GitHub issue #1872, PR #2116, bead VRMS-lw6
 */

// -- Extract the inline event generation logic for testing --
// This mirrors lines 69-100 of createRecurringEvents.js on development

function generateEventFromRecurring(filteredEvent, TODAY_DATE) {
  const eventDate = new Date(filteredEvent.date);
  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();
  const seconds = eventDate.getSeconds();
  const milliseconds = eventDate.getMilliseconds();

  const yearToday = TODAY_DATE.getFullYear();
  const monthToday = TODAY_DATE.getMonth();
  const dateToday = TODAY_DATE.getDate();

  const newEventDate = new Date(
    yearToday, monthToday, dateToday,
    hours, minutes, seconds, milliseconds,
  );

  return {
    name: filteredEvent.name,
    date: newEventDate,
    startTime: newEventDate,
  };
}

// This mirrors line 54 of createRecurringEvents.js
function getEventDay(event) {
  return new Date(event.date).getDay();
}

// -- The tests --

describe('Event day-of-week detection', () => {
  test('Tuesday 7pm PST event should be detected as Tuesday regardless of server timezone', () => {
    // Tuesday Jan 7, 2025 at 7pm PST = Wednesday Jan 8, 2025 at 3am UTC
    // If the server is in UTC, getDay() returns 3 (Wednesday), not 2 (Tuesday)
    const tuesdayEventPST = {
      date: new Date('2025-01-08T03:00:00Z'), // 7pm PST Tuesday = 3am UTC Wednesday
    };

    const day = getEventDay(tuesdayEventPST);

    // This SHOULD be Tuesday (2), but on a UTC server it returns Wednesday (3)
    expect(day).toBe(2); // Tuesday
  });

  test('Monday 11pm PST event should be detected as Monday, not Tuesday', () => {
    // Monday Jan 6, 2025 at 11pm PST = Tuesday Jan 7, 2025 at 7am UTC
    const mondayLateEvent = {
      date: new Date('2025-01-07T07:00:00Z'), // 11pm PST Monday = 7am UTC Tuesday
    };

    const day = getEventDay(mondayLateEvent);

    // Should be Monday (1), but on UTC server returns Tuesday (2)
    expect(day).toBe(1); // Monday
  });

  test('event day should not change across DST spring-forward', () => {
    // Sunday March 9, 2025 at 7pm PST
    // Before spring forward: 7pm PST = UTC-8 = 3am UTC March 10
    // After spring forward:  7pm PDT = UTC-7 = 2am UTC March 10
    // Either way, getDay() on UTC returns Monday (1), not Sunday (0)
    const sundayEvent = {
      date: new Date('2025-03-10T03:00:00Z'), // 7pm PST Sunday March 9
    };

    const day = getEventDay(sundayEvent);

    // Should be Sunday (0), but on UTC server returns Monday (1)
    expect(day).toBe(0); // Sunday
  });
});

describe('Event time generation', () => {
  test('7pm PST event should generate at 7pm LA time, not at UTC hour', () => {
    // Recurring event: 7pm PST = stored as 3am UTC next day
    // generateEventFromRecurring extracts hours via getHours()
    // On a UTC server, getHours() returns 3 (3am), not 19 (7pm)

    const today = new Date('2025-01-07T08:00:00Z'); // noon PST Tuesday
    const recurringEvent = {
      name: 'Tuesday Hacknight',
      date: new Date('2025-01-01T03:00:00Z'),     // 7pm PST = 3am UTC
      startTime: new Date('2025-01-01T03:00:00Z'),
      hours: 2,
    };

    const result = generateEventFromRecurring(recurringEvent, today);

    // The generated event should be at 7pm LA time
    const startHourLA = parseInt(
      result.startTime.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        hour12: false,
      }),
      10,
    );

    expect(startHourLA).toBe(19); // 7pm
  });

  test('11pm PST event should not jump to the next day', () => {
    // 11pm PST = 7am UTC next day
    // getHours() on UTC returns 7
    // new Date(2025, 0, 7, 7, 0, 0) = 7am Jan 7 (server local)
    // This is 16 hours too early and on the wrong day in LA

    const today = new Date('2025-01-07T08:00:00Z'); // noon PST Tuesday Jan 7
    const recurringEvent = {
      name: 'Late Night Event',
      date: new Date('2025-01-01T07:00:00Z'),     // 11pm PST = 7am UTC
      startTime: new Date('2025-01-01T07:00:00Z'),
      hours: 2,
    };

    const result = generateEventFromRecurring(recurringEvent, today);

    // Should be Jan 7 at 11pm LA time
    const dayLA = parseInt(
      result.date.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        day: 'numeric',
      }),
      10,
    );
    const hourLA = parseInt(
      result.startTime.toLocaleString('en-US', {
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
    // But getHours() still returns 3 (from the stored PST-era timestamp)
    // So the event gets created at 3am server time, which is wrong

    const marchNinth = new Date('2025-03-09T20:00:00Z'); // noon PDT
    const recurringEvent = {
      name: 'Weekly Hacknight',
      date: new Date('2025-03-02T03:00:00Z'),     // 7pm PST = 3am UTC
      startTime: new Date('2025-03-02T03:00:00Z'),
      hours: 2,
    };

    const result = generateEventFromRecurring(recurringEvent, marchNinth);

    const hourLA = parseInt(
      result.startTime.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        hour12: false,
      }),
      10,
    );

    // Should be 7pm (19), not 8pm (20) or some other shifted time
    expect(hourLA).toBe(19);
  });
});

describe('Checkin open/close window — DST transitions', () => {
  // openCheckins filters: startMs >= laNowMs && startMs <= thirtyMinutesFromLaNow
  // Both sides use different fake-UTC conversions that can disagree during DST

  test('checkin should open 15min before a 7pm event on spring-forward day', () => {
    // March 9, 2025: spring forward
    // Event at 7pm PDT (post-transition) = stored as fake-UTC by createRecurringEvents
    // "Now" is 6:45pm PDT = 1:45am UTC March 10
    //
    // The event was stored during PST era at 7pm PST = 3am UTC
    // But today is PDT, so 7pm PDT = 2am UTC
    // The stored event.date is at 3am UTC (PST offset), but real 7pm PDT is 2am UTC
    // This 1-hour mismatch means the checkin window calculation is wrong

    // Simulate: event stored with PST offset
    const eventDateStored = new Date('2025-03-10T03:00:00Z'); // 7pm PST = 3am UTC

    // "Now" in real life: 6:45pm PDT March 9 = 1:45am UTC March 10
    const nowReal = new Date('2025-03-10T01:45:00Z');

    // What openCheckins does (PR #2116 approach):
    const laNow = new Date(
      nowReal.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    );
    const laNowMs = laNow.getTime();
    const thirtyMinFromNow = laNowMs + 1800000;
    const startMs = eventDateStored.getTime();

    const inWindow = startMs >= laNowMs && startMs <= thirtyMinFromNow;

    // 6:45pm is 15min before 7pm — should be in the 30-minute window
    expect(inWindow).toBe(true);
  });

  test('checkin should close 3hrs after a 7pm event on fall-back day', () => {
    // November 2, 2025: fall back (2am PDT -> 1am PST)
    // Event at 7pm PST (post-transition) = 3am UTC Nov 3
    // 3 hours after start = 10pm PST = 6am UTC Nov 3
    // "Now" is 10:05pm PST = 6:05am UTC Nov 3

    const eventDateStored = new Date('2025-11-03T03:00:00Z'); // 7pm PST
    const nowReal = new Date('2025-11-03T06:05:00Z');         // 10:05pm PST

    const laNow = new Date(
      nowReal.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    );
    const laNowMs = laNow.getTime();
    const threeHoursFromStart = eventDateStored.getTime() + 10800000;

    // closeCheckins: laNowMs >= threeHoursFromStartTime
    const shouldClose = laNowMs >= threeHoursFromStart;

    expect(shouldClose).toBe(true);
  });
});
