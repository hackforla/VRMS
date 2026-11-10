import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { refreshSession } from '../api/authV2';
import LoginV2 from './LoginV2';

const user = {
  id: '1',
  email: 'volunteer@example.com',
  username: 'volunteer',
  accessLevel: 'user',
};
const session = { accessToken: 'access-1', expiresIn: 900, user };

function reply(status: number, body?: unknown) {
  return Promise.resolve(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

// Answers fetch calls by "METHOD /path", recording each call.
function mockApi(routes: Record<string, () => Promise<Response>>) {
  const fetchMock = vi.fn((url: string, init?: RequestInit) => {
    const key = `${init?.method ?? 'GET'} ${url}`;
    const handler = routes[key];
    if (!handler) throw new Error(`unexpected request: ${key}`);
    return handler();
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const callsTo = (fetchMock: ReturnType<typeof vi.fn>, key: string) =>
  fetchMock.mock.calls.filter(([url, init]) => `${init?.method ?? 'GET'} ${url}` === key);

describe('LoginV2 page', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test('signs the user straight back in on reload when the refresh cookie is still good', async () => {
    mockApi({ 'POST /api/auth/v2/refresh': () => reply(200, session) });
    render(<LoginV2 />);

    expect(screen.getByText(/checking for an existing session/i)).toBeTruthy();
    expect(await screen.findByText('volunteer')).toBeTruthy();
    expect(screen.queryByLabelText('Password')).toBeNull();
  });

  test('shows the sign-in form when there is no session, then signs in', async () => {
    const fetchMock = mockApi({
      'POST /api/auth/v2/refresh': () => reply(401, { error: 'No refresh token' }),
      'POST /api/auth/v2/signin': () => reply(200, session),
    });
    render(<LoginV2 />);

    fireEvent.change(await screen.findByLabelText('Email or username'), {
      target: { value: 'volunteer' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct horse battery' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText(/signed in as/i)).toBeTruthy();
    const [, init] = callsTo(fetchMock, 'POST /api/auth/v2/signin')[0];
    expect(JSON.parse(init.body)).toEqual({
      identifier: 'volunteer',
      password: 'correct horse battery',
    });
    // The tokens are kept in memory only.
    expect(localStorage.length).toBe(0);
  });

  test('shows the server message when the password is wrong', async () => {
    mockApi({
      'POST /api/auth/v2/refresh': () => reply(401, { error: 'No refresh token' }),
      'POST /api/auth/v2/signin': () =>
        reply(401, { error: 'Incorrect email/username or password' }),
    });
    render(<LoginV2 />);

    fireEvent.change(await screen.findByLabelText('Email or username'), {
      target: { value: 'volunteer' },
    });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong password!!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Incorrect email/username or password',
    );
    expect(screen.queryByText(/signed in as/i)).toBeNull();
  });

  test('creates an account from the sign-up form', async () => {
    const fetchMock = mockApi({
      'POST /api/auth/v2/refresh': () => reply(401, {}),
      'POST /api/auth/v2/signup': () => reply(201, session),
    });
    render(<LoginV2 />);

    fireEvent.click(await screen.findByRole('button', { name: /create one/i }));
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'volunteer@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct horse battery' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText(/signed in as/i)).toBeTruthy();
    const [, init] = callsTo(fetchMock, 'POST /api/auth/v2/signup')[0];
    expect(JSON.parse(init.body)).toMatchObject({ email: 'volunteer@example.com' });
  });

  test('sends the access token to the API and signs out', async () => {
    const fetchMock = mockApi({
      'POST /api/auth/v2/refresh': () => reply(200, session),
      'GET /api/auth/v2/me': () => reply(200, { user }),
      'POST /api/auth/v2/logout': () => reply(204),
    });
    render(<LoginV2 />);

    fireEvent.click(await screen.findByRole('button', { name: 'Check session' }));
    expect(await screen.findByText(/accepted by the server/i)).toBeTruthy();
    const [, init] = callsTo(fetchMock, 'GET /api/auth/v2/me')[0];
    expect(init.headers.Authorization).toBe('Bearer access-1');

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeTruthy();
    expect(callsTo(fetchMock, 'POST /api/auth/v2/logout')).toHaveLength(1);
  });

  test('refreshes once and retries when the access token has expired', async () => {
    let meCalls = 0;
    const fetchMock = mockApi({
      'POST /api/auth/v2/refresh': () => reply(200, session),
      'GET /api/auth/v2/me': () => reply(++meCalls === 1 ? 401 : 200, { user }),
    });
    render(<LoginV2 />);

    fireEvent.click(await screen.findByRole('button', { name: 'Check session' }));
    expect(await screen.findByText(/accepted by the server/i)).toBeTruthy();
    expect(callsTo(fetchMock, 'POST /api/auth/v2/refresh')).toHaveLength(2); // on load, then on the 401
  });
});

describe('refreshSession', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('shares one request between simultaneous callers', async () => {
    const fetchMock = mockApi({ 'POST /api/auth/v2/refresh': () => reply(200, session) });

    const [first, second] = await Promise.all([refreshSession(), refreshSession()]);

    expect(first).toEqual(user);
    expect(second).toEqual(user);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
