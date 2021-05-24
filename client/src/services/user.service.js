import { HEADERS, CHECK_USER, SIGN_IN } from '../utils/endpoints';

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
    return response.status === 200;
  } catch (error) {
    console.log('User is not authorized in app');
    console.log(error);
    return null;
  }
}
