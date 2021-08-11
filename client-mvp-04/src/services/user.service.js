import { HEADERS, CHECK_USER, SIGN_IN } from '../utils/endpoints';

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
