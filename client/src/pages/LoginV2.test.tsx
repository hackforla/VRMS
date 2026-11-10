import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import LoginV2 from './LoginV2';

const user = {
  id: '1',
  name: 'Vera Volunteer',
  email: 'volunteer@example.com',
  username: 'volunteer',
  accessLevel: 'user',
};
const session = { session: { id: 's1' }, user };

function reply(status: number, body?: unknown) {
  return Promise.resolve(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

interface Call {
  key: string;
  headers: Headers;
  credentials?: RequestCredentials;
  body: unknown;
}

// Answers the library's fetch calls by "METHOD /path" and records each one.
function mockApi(routes: Record<string, () => Promise<Response>>) {
  const calls: Call[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : null;
    const url = new URL(request ? request.url : String(input), window.location.origin);
    const method = (init?.method ?? request?.method ?? 'GET').toUpperCase();
    const key = `${method} ${url.pathname}`;
    const rawBody = init?.body ?? (request ? await request.clone().text() : undefined);
    calls.push({
      key,
      headers: new Headers(init?.headers ?? request?.headers),
      credentials: init?.credentials ?? request?.credentials,
      body: typeof rawBody === 'string' && rawBody ? JSON.parse(rawBody) : undefined,
    });
    const handler = routes[key];
    if (!handler) throw new Error(`unexpected request: ${key}`);
    return handler();
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

const callsTo = (calls: Call[], key: string) => calls.filter((call) => call.key === key);

describe('LoginV2 page', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test('shows the signed-in user on reload when the session cookie is still good', async () => {
    const calls = mockApi({ 'GET /api/auth/v2/get-session': () => reply(200, session) });
    render(<LoginV2 />);

    expect(screen.getByText(/checking for an existing session/i)).toBeTruthy();
    expect(await screen.findByText('volunteer')).toBeTruthy();
    expect(screen.queryByLabelText('Password')).toBeNull();

    // Requests carry the app's custom header and the session cookie.
    const [call] = callsTo(calls, 'GET /api/auth/v2/get-session');
    expect(call.headers.get('x-customrequired-header')).toBeTruthy();
    expect(call.credentials).toBe('include');
  });

  test('shows the sign-in form when there is no session, then signs in by username', async () => {
    let signedIn = false;
    const calls = mockApi({
      'GET /api/auth/v2/get-session': () => (signedIn ? reply(200, session) : reply(200, null)),
      'POST /api/auth/v2/sign-in/username': () => {
        signedIn = true;
        return reply(200, { token: 't', user });
      },
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
    expect(callsTo(calls, 'POST /api/auth/v2/sign-in/username')[0].body).toMatchObject({
      username: 'volunteer',
      password: 'correct horse battery',
    });
    // No tokens in browser storage: the session is an httpOnly cookie.
    expect(localStorage.length).toBe(0);
  });

  test('signs in with an email address when the identifier contains @', async () => {
    let signedIn = false;
    const calls = mockApi({
      'GET /api/auth/v2/get-session': () => (signedIn ? reply(200, session) : reply(200, null)),
      'POST /api/auth/v2/sign-in/email': () => {
        signedIn = true;
        return reply(200, { token: 't', user });
      },
    });
    render(<LoginV2 />);

    fireEvent.change(await screen.findByLabelText('Email or username'), {
      target: { value: 'volunteer@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct horse battery' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText(/signed in as/i)).toBeTruthy();
    expect(callsTo(calls, 'POST /api/auth/v2/sign-in/email')[0].body).toMatchObject({
      email: 'volunteer@example.com',
    });
  });

  test('shows the server message when the password is wrong', async () => {
    mockApi({
      'GET /api/auth/v2/get-session': () => reply(200, null),
      'POST /api/auth/v2/sign-in/username': () =>
        reply(401, {
          code: 'INVALID_USERNAME_OR_PASSWORD',
          message: 'Invalid username or password',
        }),
    });
    render(<LoginV2 />);

    fireEvent.change(await screen.findByLabelText('Email or username'), {
      target: { value: 'volunteer' },
    });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong password!!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Invalid username or password');
    expect(screen.queryByText(/signed in as/i)).toBeNull();
  });

  test('creates an account from the sign-up form', async () => {
    let signedIn = false;
    const calls = mockApi({
      'GET /api/auth/v2/get-session': () => (signedIn ? reply(200, session) : reply(200, null)),
      'POST /api/auth/v2/sign-up/email': () => {
        signedIn = true;
        return reply(200, { token: 't', user });
      },
    });
    render(<LoginV2 />);

    fireEvent.click(await screen.findByRole('button', { name: /create one/i }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Vera Volunteer' } });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'volunteer@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Username (optional)'), {
      target: { value: 'volunteer' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct horse battery' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText(/signed in as/i)).toBeTruthy();
    expect(callsTo(calls, 'POST /api/auth/v2/sign-up/email')[0].body).toMatchObject({
      name: 'Vera Volunteer',
      email: 'volunteer@example.com',
      username: 'volunteer',
      password: 'correct horse battery',
    });
  });

  test('checks the session with the server and signs out', async () => {
    const calls = mockApi({
      'GET /api/auth/v2/get-session': () => reply(200, session),
      'POST /api/auth/v2/sign-out': () => reply(200, { success: true }),
    });
    render(<LoginV2 />);

    fireEvent.click(await screen.findByRole('button', { name: 'Check session' }));
    expect(await screen.findByText(/accepted by the server/i)).toBeTruthy();
    expect(callsTo(calls, 'GET /api/auth/v2/get-session')).toHaveLength(2); // on load, then on click

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeTruthy();
    expect(callsTo(calls, 'POST /api/auth/v2/sign-out')).toHaveLength(1);
  });
});
