import { describe, it, expect, afterEach, vi } from 'vitest';
import MockDate from 'mockdate';
import type { VRMSEvent } from './types.ts';

// Unmock — vitest.setup.js globally mocks all workers
vi.unmock('./closeCheckins.js');
vi.unmock('./closeCheckins.ts');

import { filterEventsToClose } from './closeCheckins.ts';

describe('closeCheckins — filterEventsToClose', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const makeEvent = (date: string, checkInReady = true): VRMSEvent => ({
    _id: `evt-${date}`,
    name: 'Test Event',
    date,
    checkInReady,
  });

  // --- Basic behavior ---

  it('returns empty array when no events', () => {
    expect(filterEventsToClose([], new Date())).toEqual([]);
    expect(filterEventsToClose(null, new Date())).toEqual([]);
  });

  it('skips events with no date', () => {
    const events = [{ _id: '1', name: 'No Date', checkInReady: true } as VRMSEvent];
    expect(filterEventsToClose(events, new Date())).toEqual([]);
  });

  it('skips events with invalid date strings', () => {
    const events = [makeEvent('not-a-date', true)];
    expect(filterEventsToClose(events, new Date())).toEqual([]);
  });

  it('skips events not open for check-in', () => {
    MockDate.set('2024-01-15T23:00:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', false)];
    expect(filterEventsToClose(events, new Date())).toEqual([]);
  });

  it('closes event 3+ hours after start', () => {
    MockDate.set('2024-01-15T22:05:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', true)];
    const result = filterEventsToClose(events, new Date());
    expect(result).toHaveLength(1);
  });

  it('does NOT close event less than 3 hours after start', () => {
    MockDate.set('2024-01-15T21:00:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', true)];
    expect(filterEventsToClose(events, new Date())).toEqual([]);
  });

  it('closes event exactly at 3 hours after start', () => {
    MockDate.set('2024-01-15T22:00:00Z');
    const events = [makeEvent('2024-01-15T19:00:00Z', true)];
    const result = filterEventsToClose(events, new Date());
    expect(result).toHaveLength(1);
  });

  // --- DST: timezone-aware comparison ---

  it('spring forward: event closes 3h after start during PDT', () => {
    MockDate.set('2024-03-13T06:05:00Z');
    const events = [makeEvent('2024-03-13T03:00:00Z', true)];
    const result = filterEventsToClose(events, new Date());
    expect(result).toHaveLength(1);
  });

  it('spring forward: event does NOT close before 3h during PDT', () => {
    MockDate.set('2024-03-13T05:05:00Z');
    const events = [makeEvent('2024-03-13T03:00:00Z', true)];
    expect(filterEventsToClose(events, new Date())).toHaveLength(0);
  });

  it('fall back: event closes 3h after start during PST', () => {
    MockDate.set('2024-11-06T05:05:00Z');
    const events = [makeEvent('2024-11-06T02:00:00Z', true)];
    const result = filterEventsToClose(events, new Date());
    expect(result).toHaveLength(1);
  });

  it('fall back: event does NOT close before 3h during PST', () => {
    MockDate.set('2024-11-06T04:55:00Z');
    const events = [makeEvent('2024-11-06T02:00:00Z', true)];
    expect(filterEventsToClose(events, new Date())).toHaveLength(0);
  });

  // --- Multiple events ---

  it('handles multiple events, returning only eligible ones', () => {
    MockDate.set('2024-01-15T22:05:00Z');
    const events = [
      makeEvent('2024-01-15T19:00:00Z', true), // 3h5m ago, open → close
      makeEvent('2024-01-15T20:00:00Z', true), // 2h5m ago, open → skip
      makeEvent('2024-01-15T18:00:00Z', true), // 4h5m ago, open → close
      makeEvent('2024-01-15T19:00:00Z', false), // 3h5m ago, already closed → skip
    ];
    const result = filterEventsToClose(events, new Date());
    expect(result).toHaveLength(2);
  });
});
