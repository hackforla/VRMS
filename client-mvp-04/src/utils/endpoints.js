export const HEADERS = {
  'Content-Type': 'application/json',
  'x-customrequired-header': process.env.REACT_APP_CUSTOM_REQUEST_HEADER,
};

export const CHECK_USER = '/api/checkuser';
export const SIGN_IN = '/api/auth/signin';
export const AUTH_VERIFY_TOKEN = '/api/auth/verify-signin';
