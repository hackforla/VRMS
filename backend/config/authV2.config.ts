// Settings for Login v2 (/api/auth/v2), which runs on Better Auth. Read lazily
// so the existing app boots without any of these variables; v2 answers 503
// until both required ones are set.

export const AUTH_V2_BASE_PATH = '/api/auth/v2';

// Header the v2 handler sets from Express's req.ip so rate limiting sees the real
// client address (and ignores any X-Forwarded-For a caller makes up).
export const CLIENT_IP_HEADER = 'x-vrms-client-ip';

const MIN_SECRET_LENGTH = 32;

export function getAuthSecret(): string | null {
  const secret = process.env.AUTH_V2_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

// The public origin the browser uses for the site (the client and the API share it),
// e.g. https://vrms.example or http://localhost:3000 in development. Better Auth
// uses it for cookie settings and to reject sign-ins started from other origins.
export function getBaseUrl(): string | null {
  const value = process.env.AUTH_V2_BASE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : null;
  } catch {
    return null;
  }
}

export function isAuthV2Configured(): boolean {
  return getAuthSecret() !== null && getBaseUrl() !== null;
}

// Sign-in and sign-up requests allowed per client IP per minute.
export function getSigninLimit(): number {
  const limit = Number(process.env.AUTH_V2_SIGNIN_LIMIT);
  return Number.isInteger(limit) && limit > 0 ? limit : 10;
}
