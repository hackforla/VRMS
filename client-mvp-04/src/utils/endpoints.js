import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../../client/src/utils/globalSettings";

export const HEADERS = {
  'Content-Type': 'application/json',
  'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
};

// Inner API's
export const CHECK_USER = '/api/checkuser';
export const SIGN_IN = '/api/auth/signin';
export const AUTH_VERIFY_SIGN_IN = '/api/auth/verify-signin';

// External API's
export const CODE_OF_CONDUCT =
  'https://raw.githubusercontent.com/hackforla/codeofconduct/master/README.md';
