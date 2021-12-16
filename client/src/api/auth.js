import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

const BASE_URL = '/api/auth';

const DEFAULT_HEADERS = {
  'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER
};

export const fetchLogout = async () => {
  return await fetch(BASE_URL + '/logout', {
    method: 'POST',
    headers: DEFAULT_HEADERS,
  });
}
