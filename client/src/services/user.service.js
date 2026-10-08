import { AUTH_VERIFY_SIGN_IN, CHECK_USER, HEADERS, SIGN_IN } from '../utils/endpoints';

/**
 * Reads a JSON body, returning null when the response carries none.
 * `res.sendStatus()` and proxy error pages send plain text, so parsing must be
 * allowed to fail without losing the status code we already have.
 */
async function readJsonBody(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Method sent request to the backend to check if user exist in the DB
 *
 * Never collapses distinct failures into one value: callers need to tell an
 * unknown email apart from a broken server to show the right message.
 *
 * @returns on success `{ ok: true, user, auth_origin }`; on failure
 *   `{ ok: false, code, status, message }` where `code` is one of the codes
 *   documented in backend/routers/checkUser.router.js, or NETWORK_ERROR when
 *   the request never reached the server (`status` is then null).
 * @param email user email
 * @param auth_origin auth origin 'LOG_IN' or 'CREATE_ACCOUNT'
 */
export async function checkUser(email, auth_origin) {
  let response;

  try {
    response = await fetch(CHECK_USER, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email: email, auth_origin: auth_origin }),
    });
  } catch (error) {
    // Rejects only when no response arrived at all: offline, DNS, server down.
    console.log('Could not reach the login service');
    console.log(error);
    return { ok: false, code: 'NETWORK_ERROR', status: null };
  }

  const body = await readJsonBody(response);

  if (response.ok) {
    // A 200 with no parsable user is a broken server, not a missing account.
    if (!body || !body.user) {
      return { ok: false, code: 'SERVER_ERROR', status: response.status };
    }
    return { ok: true, user: body.user, auth_origin: body.auth_origin };
  }

  return {
    ok: false,
    status: response.status,
    code: body?.code ?? 'SERVER_ERROR',
    message: body?.message,
  };
}

/**
 * Method sent request to the backend to check if user can login in app
 * @returns true if user can login otherwise null
 * @param email user email
 * @param auth_origin auth origin 'LOG_IN' or "CREATE_ACCOUNT'
 */
export async function checkAuth(email, auth_origin) {
  try {
    const response = await fetch(SIGN_IN, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email: email, auth_origin: auth_origin }),
    });
    return response.status === 200;
  } catch (error) {
    console.log('User is not authorized in app');
    console.log(error);
    return null;
  }
}

/**
 * Method sent request to the backend to check if token is valid
 * @returns true if is valid otherwise false
 * @param api_token token
 */
export async function isValidToken(api_token) {
  try {
    const response = await fetch(AUTH_VERIFY_SIGN_IN, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'x-access-token': api_token,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.log('Token is not valid');
    console.log(error);
    return false;
  }
}
