import { describe, it, expect } from 'vitest';
import adjustToLosAngelesTime from './adjustToLosAngelesTime.js';

describe('adjustToLosAngelesTime', () => {
  it('should adjust UTC to PST (winter, UTC-8)', () => {
    const utc = new Date('2024-01-15T08:00:00Z');
    const result = adjustToLosAngelesTime(utc);
    // 08:00 UTC - 8h = 00:00 LA time
    expect(result.toISOString()).toBe('2024-01-15T00:00:00.000Z');
  });

  it('should adjust UTC to PDT (summer, UTC-7)', () => {
    const utc = new Date('2024-07-15T07:00:00Z');
    const result = adjustToLosAngelesTime(utc);
    // 07:00 UTC - 7h = 00:00 LA time
    expect(result.toISOString()).toBe('2024-07-15T00:00:00.000Z');
  });

  it('should handle day before DST starts (PST, UTC-8)', () => {
    const utc = new Date('2024-03-10T07:00:00Z');
    const result = adjustToLosAngelesTime(utc);
    // Mar 10 07:00 UTC — still PST at this point (spring forward happens at 2am PST = 10:00 UTC)
    // 07:00 - 8h = Mar 9 23:00
    expect(result.toISOString()).toBe('2024-03-09T23:00:00.000Z');
  });

  it('should handle day after DST starts (PDT, UTC-7)', () => {
    const utc = new Date('2024-03-11T07:00:00Z');
    const result = adjustToLosAngelesTime(utc);
    // 07:00 UTC - 7h = 00:00 LA time
    expect(result.toISOString()).toBe('2024-03-11T00:00:00.000Z');
  });

  it('should handle day after DST ends (PST, UTC-8)', () => {
    const utc = new Date('2024-11-04T08:00:00Z');
    const result = adjustToLosAngelesTime(utc);
    // 08:00 UTC - 8h = 00:00 LA time
    expect(result.toISOString()).toBe('2024-11-04T00:00:00.000Z');
  });

  it('should accept string dates', () => {
    const result = adjustToLosAngelesTime('2024-01-15T08:00:00Z');
    expect(result.toISOString()).toBe('2024-01-15T00:00:00.000Z');
  });
});
