import { createAuthClient } from 'better-auth/client';
import { usernameClient } from 'better-auth/client/plugins';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

// Better Auth client for Login v2. The API lives under /api/auth/v2 on the same
// origin as the app; the session is an httpOnly cookie the browser manages, so
// no token is ever held in JavaScript.
export const authV2 = createAuthClient({
  baseURL: window.location.origin,
  basePath: '/api/auth/v2',
  fetchOptions: {
    credentials: 'include',
    // Look fetch up per call so tests (and polyfills) can replace it.
    customFetchImpl: (...args: Parameters<typeof fetch>) => fetch(...args),
    headers: { 'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER },
  },
  plugins: [usernameClient()],
});
