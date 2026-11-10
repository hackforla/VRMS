// Settings for Login v2 (/api/auth/v2). Read lazily so the existing app boots
// without any of these variables; v2 routes answer 503 until they are set.

export const REFRESH_COOKIE_NAME = 'vrms_refresh_v2';
// Scoped to the v2 routes so the cookie is never sent to the rest of the API.
export const REFRESH_COOKIE_PATH = '/api/auth/v2';

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
// A rotated refresh token that shows up again within this window is treated as
// a harmless race (two tabs reloading at once) rather than as theft.
export const REFRESH_REUSE_GRACE_MS = 10 * 1000;

const MIN_SECRET_LENGTH = 32;

export function getAccessTokenSecret(): string | null {
  const secret = process.env.AUTH_V2_ACCESS_TOKEN_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

export function isAuthV2Configured(): boolean {
  return getAccessTokenSecret() !== null;
}

export function getBcryptRounds(): number {
  const rounds = Number(process.env.AUTH_V2_BCRYPT_ROUNDS);
  return Number.isInteger(rounds) && rounds >= 4 && rounds <= 15 ? rounds : 12;
}
