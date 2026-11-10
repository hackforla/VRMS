import { type FormEvent, useEffect, useState } from 'react';
import { authV2 } from '../api/authV2';

// Standalone Login v2 page (route: /login-v2). It is not linked from the app
// and does not touch the current login flow; it exists to exercise sign-up,
// sign-in, staying signed in across a reload, and sign-out. The work is done by
// Better Auth; this page only drives its client.

interface SessionUser {
  email: string;
  name: string;
  username?: string | null;
  accessLevel?: string;
}

type Mode = 'signin' | 'signup';

// Explicit borders: the app's global styles leave bare inputs and buttons invisible.
const fieldStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  margin: '4px 0 12px',
  padding: 8,
  border: '1px solid #767676',
  borderRadius: 4,
  font: 'inherit',
} as const;
const buttonStyle = {
  padding: '8px 16px',
  border: '1px solid #767676',
  borderRadius: 4,
  background: '#f3f3f3',
  font: 'inherit',
  cursor: 'pointer',
} as const;

// An identifier with an @ is an email address; anything else is a username.
function signInWith(identifier: string, password: string) {
  return identifier.includes('@')
    ? authV2.signIn.email({ email: identifier, password })
    : authV2.signIn.username({ username: identifier, password });
}

export default function LoginV2() {
  // undefined = still checking for an existing session, null = signed out
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [mode, setMode] = useState<Mode>('signin');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessionCheck, setSessionCheck] = useState('');

  // The session cookie survives a reload, so ask the server who we are.
  useEffect(() => {
    let active = true;
    authV2
      .getSession()
      .then(({ data }) => (data?.user as SessionUser | undefined) ?? null)
      .catch(() => null)
      .then((restored) => {
        if (active) setUser(restored);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data, error: failure } =
        mode === 'signin'
          ? await signInWith(identifier, password)
          : await authV2.signUp.email({
              name,
              email,
              password,
              ...(username ? { username } : {}),
            });
      if (failure || !data) {
        setError(failure?.message || 'Something went wrong');
        return;
      }
      const current = await authV2.getSession();
      setUser((current.data?.user as SessionUser | undefined) ?? null);
      setPassword('');
    } catch {
      setError('Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  async function checkSession() {
    const { data } = await authV2.getSession();
    setSessionCheck(data ? 'Session accepted by the server.' : 'Session rejected.');
  }

  async function signOut() {
    await authV2.signOut().catch(() => undefined);
    setUser(null);
    setSessionCheck('');
  }

  if (user === undefined) return <p style={{ padding: 16 }}>Checking for an existing session…</p>;

  if (user) {
    return (
      <section style={{ padding: 16 }}>
        <h1>Login v2</h1>
        <p>
          Signed in as <strong>{user.username || user.email}</strong>
        </p>
        <p>Email: {user.email}</p>
        <p>Access level: {user.accessLevel}</p>
        <button type="button" style={buttonStyle} onClick={checkSession}>
          Check session
        </button>{' '}
        <button type="button" style={buttonStyle} onClick={signOut}>
          Sign out
        </button>
        {sessionCheck && <output>{sessionCheck}</output>}
        <p>Reload the page: you stay signed in until you sign out.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: 16 }}>
      <h1>Login v2</h1>
      <p>{mode === 'signin' ? 'Sign in with your email or username.' : 'Create a VRMS account.'}</p>
      <form onSubmit={submit}>
        {mode === 'signin' ? (
          <label>
            Email or username
            <input
              style={fieldStyle}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
        ) : (
          <>
            <label>
              Name
              <input
                style={fieldStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label>
              Email
              <input
                style={fieldStyle}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Username (optional)
              <input
                style={fieldStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>
          </>
        )}
        <label>
          Password
          <input
            style={fieldStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={mode === 'signup' ? 10 : undefined}
            required
          />
        </label>
        {error && (
          <p role="alert" style={{ color: '#b00020' }}>
            {error}
          </p>
        )}
        <button type="submit" style={buttonStyle} disabled={busy}>
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <p>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError('');
          }}
        >
          {mode === 'signin' ? 'Need an account? Create one' : 'Have an account? Sign in'}
        </button>
      </p>
    </section>
  );
}
