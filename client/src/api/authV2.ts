import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

// Client for Login v2 (/api/auth/v2). The short-lived access token lives only
// in this module's memory, so reloading the page forgets it; the httpOnly
// refresh cookie (which JavaScript never sees) is how a reload signs back in.

const BASE_URL = '/api/auth/v2';

export interface AuthV2User {
  id: string;
  email?: string;
  username?: string;
  name?: { firstName?: string; lastName?: string };
  accessLevel?: string;
}

interface SessionResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthV2User;
}

let accessToken: string | null = null;
let refreshInFlight: Promise<AuthV2User | null> | null = null;

function request(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(BASE_URL + path, {
    credentials: 'same-origin',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
      ...init.headers,
    },
  });
}

async function readError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? `Request failed (${res.status})`;
}

async function startSession(path: string, body: object): Promise<AuthV2User> {
  const res = await request(path, { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await readError(res));
  const session: SessionResponse = await res.json();
  accessToken = session.accessToken;
  return session.user;
}

export function signUp(fields: {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}): Promise<AuthV2User> {
  return startSession('/signup', fields);
}

export function signIn(identifier: string, password: string): Promise<AuthV2User> {
  return startSession('/signin', { identifier, password });
}

// Trades the refresh cookie for a new access token. Resolves to the signed-in
// user, or null when there is no valid session. Concurrent callers share one
// request: the server only accepts each refresh token once.
export function refreshSession(): Promise<AuthV2User | null> {
  refreshInFlight ??= (async () => {
    try {
      const res = await request('/refresh', { method: 'POST' });
      if (!res.ok) {
        accessToken = null;
        return null;
      }
      const session: SessionResponse = await res.json();
      accessToken = session.accessToken;
      return session.user;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function logout(): Promise<void> {
  accessToken = null;
  await request('/logout', { method: 'POST' });
}

// Calls a v2 endpoint with the access token; if it has expired, refreshes once
// and retries.
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = () =>
    request(path, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${accessToken}` },
    });

  const res = await send();
  if (res.status !== 401) return res;
  return (await refreshSession()) ? send() : res;
}
