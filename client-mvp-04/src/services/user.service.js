import { HEADERS, CHECK_USER, SIGN_IN } from '../utils/endpoints';
import React from 'react';

export async function checkAuth(email) {
  try {
    const response = await fetch(SIGN_IN, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email: email }),
    });
    return response.status === 200;
  } catch (error) {
    console.log('User is not authorized in app');
    console.log(error);
    return null;
  }
}

export async function checkUser(email) {
  try {
    const response = await fetch(CHECK_USER, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email: email }),
    });
    return await response.json();
  } catch (error) {
    console.log('User is not registered in the app');
    console.log(error);
    return null;
  }
}
