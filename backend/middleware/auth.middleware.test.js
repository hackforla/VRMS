import { describe, test, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { addCookieIfAvailable } from './auth.middleware.js';

describe('addCookieIfAvailable', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      sendStatus: vi.fn(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  test('sets req.userId from valid JWT cookie', () => {
    const secret = process.env.JWT_SECRET || 'placeholder_secret_key_for_development_only';
    const token = jwt.sign({ id: 'user-abc', email: 'test@test.com' }, secret);
    req.cookies.token = token;

    addCookieIfAvailable(req, res, next);

    // jwt.verify is async via callback, so we need to wait
    // The callback is synchronous in this context though
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('user-abc');
  });

  test('calls next() without setting req.userId when no cookie present', () => {
    req.cookies = {};

    addCookieIfAvailable(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
  });

  test('calls next() without setting req.userId when JWT is invalid', () => {
    req.cookies.token = 'invalid-token-value';

    addCookieIfAvailable(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
  });

  test('never sends a response (non-blocking middleware)', () => {
    req.cookies.token = 'invalid-token-value';

    addCookieIfAvailable(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
