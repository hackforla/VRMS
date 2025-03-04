const {
  fetchData,
  adjustToLosAngelesTime,
  isSameUTCDate,
  doesEventExist,
  createEvent,
  filterAndCreateEvents,
  runTask,
  scheduleTask,
} = require('./createRecurringEvents');
const { generateEventData } = require('./lib/generateEventData');

const MockDate = require('mockdate');
const cron = require('node-cron');

jest.mock('./lib/generateEventData', () => ({
  generateEventData: jest.fn((event) => ({
    ...event,
    generated: true,
  })),
}));

jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('createRecurringEvents Module Tests', () => {
  const mockURL = 'http://localhost:3000';
  const mockHeader = 'mock-header';
  let mockEvents;
  let mockRecurringEvents;

  beforeEach(() => {
    MockDate.set('2023-11-02T00:00:00Z');

    mockEvents = [
      { name: 'Event 1', date: '2023-11-02T19:00:00Z' },
      { name: 'Event 2', date: '2023-11-02T07:00:00Z' },
    ];
    mockRecurringEvents = [
      { name: 'Event 1', date: '2023-11-02T19:00:00Z' },
      { name: 'Event 2', date: '2023-11-02T07:00:00Z' },
      { name: 'Event 3', date: '2023-11-03T07:00:00Z' }, // Does not match today
    ];

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  describe('fetchData', () => {
    it('should fetch data from the API endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvents),
      });

      const result = await fetchData('/api/events/', mockURL, mockHeader, fetch);

      expect(fetch).toHaveBeenCalledWith(`${mockURL}/api/events/`, {
        headers: { 'x-customrequired-header': mockHeader },
      });
      expect(result).toEqual(mockEvents);
    });

    it('should handle API fetch failures', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchData('/api/events/', mockURL, mockHeader, fetch);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('adjustToLosAngelesTime', () => {
    it('should correctly adjust timestamps before DST starts (PST -8)', () => {
      const utcTimestamp = new Date('2024-03-10T07:00:00Z'); // 7 AM UTC
      const expectedLocal = new Date('2024-03-09T23:00:00Z'); // 11 PM PST (-8)

      const result = adjustToLosAngelesTime(utcTimestamp);

      expect(result.toISOString()).toBe(expectedLocal.toISOString());
    });

    it('should correctly adjust timestamps after DST starts (PDT -7)', () => {
      const utcTimestamp = new Date('2024-03-11T07:00:00Z'); // 7 AM UTC (after DST)
      const expectedLocal = new Date('2024-03-11T00:00:00Z'); // 12 AM PDT (-7)

      const result = adjustToLosAngelesTime(utcTimestamp);

      expect(result.toISOString()).toBe(expectedLocal.toISOString());
    });

    it('should correctly adjust timestamps after DST ends (PST -8)', () => {
      const utcTimestamp = new Date('2024-11-10T08:00:00Z'); // 8 AM UTC
      const expectedLocal = new Date('2024-11-10T00:00:00Z'); // 12 AM PST (-8)

      const result = adjustToLosAngelesTime(utcTimestamp);

      expect(result.toISOString()).toBe(expectedLocal.toISOString());
    });

    it('should correctly adjust timestamps when DST ends (PST -8)', () => {
      const utcTimestamp = new Date('2024-11-03T09:00:00Z'); // 9 AM UTC
      const expectedLocal = new Date('2024-11-03T01:00:00Z'); // 1 AM PST (UTC-8)

      const result = adjustToLosAngelesTime(utcTimestamp);

      expect(result.toISOString()).toBe(expectedLocal.toISOString());
    });

    it('should correctly handle the repeated hour when DST ends (PST -8)', () => {
      const utcTimestamp = new Date('2024-11-03T08:30:00Z'); // 8:30 AM UTC
      const expectedLocal = new Date('2024-11-03T01:30:00Z'); // 1:30 AM PST (during repeat hour)

      const result = adjustToLosAngelesTime(utcTimestamp);

      expect(result.toISOString()).toBe(expectedLocal.toISOString());
    });
  });

  describe('isSameUTCDate', () => {
    it('should return true for the same UTC day', () => {
      const date1 = new Date('2023-11-02T19:00:00Z');
      const date2 = new Date('2023-11-02T10:00:00Z');
      expect(isSameUTCDate(date1, date2)).toBe(true);
    });

    it('should return false for different UTC days', () => {
      const date1 = new Date('2023-11-02T19:00:00Z');
      const date2 = new Date('2023-11-03T10:00:00Z');
      expect(isSameUTCDate(date1, date2)).toBe(false);
    });
  });

  describe('doesEventExist', () => {
    it('should return true if an event exists on the same UTC day', () => {
      const today = new Date('2023-11-02T00:00:00Z');
      expect(doesEventExist('Event 1', today, mockEvents)).toBe(true);
    });

    it('should return false if no event exists on the same UTC day', () => {
      const today = new Date('2023-11-03T00:00:00Z');
      expect(doesEventExist('Event 1', today, mockEvents)).toBe(false);
    });
  });

  describe('filterAndCreateEvents', () => {
    it('should not create events already present for today', async () => {
      await filterAndCreateEvents(mockEvents, mockRecurringEvents, mockURL, mockHeader, fetch);

      expect(generateEventData).not.toHaveBeenCalledWith(mockRecurringEvents[0]); // Recurring Event 1
      expect(generateEventData).not.toHaveBeenCalledWith(mockRecurringEvents[1]); // Recurring Event 2
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should correctly adjust an event before DST ends (UTC-7 -> UTC-8)', async () => {
      MockDate.set('2023-11-04T23:00:00Z'); // Before DST ends

      const preDstEvent = [
        {
          name: 'Pre-DST Event',
          date: '2023-11-04T08:00:00Z', // 8 AM UTC (1 AM PDT)
          startTime: '2023-11-04T08:00:00Z',
          // hours: 1,
        },
      ];
      await filterAndCreateEvents([], preDstEvent, mockURL, mockHeader, fetch);

      expect(generateEventData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Pre-DST Event' }),
      );

      const expectedEvent = {
        name: 'Pre-DST Event',
        date: new Date('2023-11-04T01:00:00Z').toISOString(), // Should match 1 AM PDT
        startTime: new Date('2023-11-04T01:00:00Z').toISOString(),
        generated: true,
      };

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({
          body: JSON.stringify(expectedEvent),
        }),
      );

      MockDate.reset();
    });

    it('should correctly adjust an event during DST ending (PDT -> PST shift)', async () => {
      MockDate.set('2023-11-05T02:00:00Z'); // The moment of DST shift

      const dstTransitionEvent = [
        {
          name: 'DST Shift Event',
          date: '2023-11-05T09:00:00Z',
          startTime: '2023-11-05T09:00:00Z',
        },
      ];

      await filterAndCreateEvents([], dstTransitionEvent, mockURL, mockHeader, fetch);

      expect(generateEventData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'DST Shift Event' }),
      );
      const expectedEvent = {
        name: 'DST Shift Event',
        date: new Date('2023-11-05T01:00:00Z').toISOString(),
        startTime: new Date('2023-11-05T01:00:00Z').toISOString(),
        generated: true,
      };

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({
          body: JSON.stringify(expectedEvent),
        }),
      );

      MockDate.reset();
    });

    it('should correctly adjust an event before DST starts (UTC-8 -> UTC-7)', async () => {
      MockDate.set('2024-03-10T09:00:00Z'); // 1 AM PST before the shift

      const preDstStartEvent = [
        {
          name: 'Pre-DST Start Event',
          date: '2024-03-10T09:00:00Z', // 1 AM PST in UTC-8
          startTime: '2024-03-10T09:00:00Z',
        },
      ];

      await filterAndCreateEvents([], preDstStartEvent, mockURL, mockHeader, fetch);

      expect(generateEventData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Pre-DST Start Event' }),
      );

      const expectedEvent = {
        name: 'Pre-DST Start Event',
        date: new Date('2024-03-10T01:00:00Z').toISOString(), // Should match 1 AM PST
        startTime: new Date('2024-03-10T01:00:00Z').toISOString(),
        generated: true,
      };

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({
          body: JSON.stringify(expectedEvent),
        }),
      );

      MockDate.reset();
    });

    it('should correctly adjust an event during DST start (PST -> PDT shift)', async () => {
      MockDate.set('2024-03-10T10:00:00Z');

      const dstStartTransitionEvent = [
        {
          name: 'DST Start Event',
          date: '2024-03-10T10:00:00Z', // 2 AM PST in UTC-8
          startTime: '2024-03-10T10:00:00Z',
        },
      ];
      await filterAndCreateEvents([], dstStartTransitionEvent, mockURL, mockHeader, fetch);

      expect(generateEventData).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'DST Start Event' }),
      );

      const expectedEvent = {
        name: 'DST Start Event',
        date: new Date('2024-03-10T03:00:00Z').toISOString(), // Should match 3 AM PDT
        startTime: new Date('2024-03-10T03:00:00Z').toISOString(),
        generated: true,
      };

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({
          body: JSON.stringify(expectedEvent),
        }),
      );

      MockDate.reset();
    });
  });

  describe('runTask', () => {
    it('should fetch data but not create events if all exist', async () => {
      // First API call response (events)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvents),
      });

      // Second API call response (recurring events)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRecurringEvents),
      });

      await runTask(fetch, mockURL, mockHeader);

      console.log('Actual fetch calls:', fetch.mock.calls);
      // Expect only 2 fetch calls (no event creation needed)
      expect(fetch).toHaveBeenCalledTimes(2);

      expect(fetch).toHaveBeenCalledWith(
        `${mockURL}/api/recurringevents/`,
        expect.objectContaining({ headers: { 'x-customrequired-header': mockHeader } }),
      );

      // Ensure no call to createEvent
      expect(fetch).not.toHaveBeenCalledWith(
        `${mockURL}/api/events/`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('createEvent', () => {
    it('should create a new event via POST request', async () => {
      const mockEvent = { name: 'Event 1', date: '2023-11-02T19:00:00Z' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 1, ...mockEvent }),
      });

      const result = await createEvent(mockEvent, mockURL, mockHeader, fetch);

      expect(fetch).toHaveBeenCalledWith(`${mockURL}/api/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': mockHeader,
        },
        body: JSON.stringify(mockEvent),
      });
      expect(result).toEqual({ id: 1, ...mockEvent });
    });

    it('should return null if event creation fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await createEvent(null, mockURL, mockHeader, fetch);

      expect(result).toBeNull();
    });
  });

  describe('scheduleTask', () => {
    it('should schedule the runTask function', () => {
      const scheduleSpy = jest.spyOn(cron, 'schedule').mockImplementation((_, callback) => {
        callback();
      });

      scheduleTask(cron, fetch, mockURL, mockHeader);

      expect(scheduleSpy).toHaveBeenCalledWith('*/30 * * * *', expect.any(Function));

      scheduleSpy.mockRestore();
    });
  });
});
