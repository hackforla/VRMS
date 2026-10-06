import { describe, it, expect, afterEach, vi } from 'vitest';
import MockDate from 'mockdate';

// Unmock — vitest.setup.js globally mocks all workers
vi.unmock('./openCheckins.js');

import { filterEventsToOpen } from './openCheckins.js';

describe('openCheckins — filterEventsToOpen', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const makeEvent = (date, checkInReady = false) => ({
    _id: `evt-${date}`,
    name: 'Test Event',
    date,
    checkInReady,
  });

  // --- Basic behavior ---

  it('returns empty array when no events', () => {
    expect(filterEventsToOpen([], new Date())).toEqual([]);
    expect(filterEventsToOpen(null, new Date())).toEqual([]);
  });

  it('skips events with no date', () => {
    const events = [{ _id: '1', name: 'No Date', checkInReady: false }];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  it('skips events with invalid date strings', () => {
    const events = [makeEvent('not-a-date', false)];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  it('skips events already open for check-in', () => {
    MockDate.set('2024-01-15T18:50:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', true)];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  it('opens event starting within 30 minutes', () => {
    MockDate.set('2024-01-15T18:50:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', false)];
    const result = filterEventsToOpen(events, new Date());
    expect(result).toHaveLength(1);
  });

  it('does NOT open event more than 30 minutes away', () => {
    MockDate.set('2024-01-15T18:00:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', false)];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  it('does NOT open event already in the past', () => {
    MockDate.set('2024-01-15T20:00:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', false)];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  // --- DST: timezone-aware comparison ---

  it('spring forward: event within 30 min during PDT', () => {
    // Event at 03:00 UTC. At 02:50 UTC → 10 min before → open.
    MockDate.set('2024-03-13T02:50:00Z');
    const events = [makeEvent('2024-03-13T03:00:00Z', false)];
    const result = filterEventsToOpen(events, new Date());
    expect(result).toHaveLength(1);
  });

  it('spring forward: event NOT within 30 min during PDT', () => {
    // Event at 03:00 UTC. At 02:00 UTC → 60 min before → skip.
    MockDate.set('2024-03-13T02:00:00Z');
    const events = [makeEvent('2024-03-13T03:00:00Z', false)];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  it('fall back: event within 30 min during PST', () => {
    // Event at 02:00 UTC. At 01:50 UTC → 10 min before → open.
    MockDate.set('2024-11-06T01:50:00Z');
    const events = [makeEvent('2024-11-06T02:00:00Z', false)];
    const result = filterEventsToOpen(events, new Date());
    expect(result).toHaveLength(1);
  });

  it('fall back: event NOT within 30 min during PST', () => {
    MockDate.set('2024-11-06T01:00:00Z');
    const events = [makeEvent('2024-11-06T02:00:00Z', false)];
    expect(filterEventsToOpen(events, new Date())).toEqual([]);
  });

  // --- Multiple events ---

  it('handles multiple events, returning only eligible ones', () => {
    MockDate.set('2024-01-15T18:50:00Z');
    const events = [
      makeEvent('2024-01-15T19:00:00Z', false), // 10 min away, closed → open
      makeEvent('2024-01-15T20:00:00Z', false), // 70 min away → skip
      makeEvent('2024-01-15T19:10:00Z', false), // 20 min away, closed → open
      makeEvent('2024-01-15T19:00:00Z', true), // 10 min away, already open → skip
    ];
    const result = filterEventsToOpen(events, new Date());
    expect(result).toHaveLength(2);
  });
});
