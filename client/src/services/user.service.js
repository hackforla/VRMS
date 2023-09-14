import {
  HEADERS,
  CHECK_USER,
  SIGN_IN,
  AUTH_VERIFY_SIGN_IN,
} from '../utils/endpoints';

/**
 * Method sent request to the backend to check if user exist in the DB
 * @returns user data otherwise null
 * @param email user email
 * @param auth_origin auth origin 'LOG_IN' or 'CREATE_ACCOUNT'
 */
export async function checkUser(email, auth_origin) {
  try {
    const response = await fetch(CHECK_USER, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email: email, auth_origin: auth_origin }),
    });
    return await response.json();
  } catch (error) {
    console.log('User is not registered in the app');
    console.log(error);
    return null;
  }
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
   
    const token = await response.json()
    return token
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
