import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";

const BASE_URL = '/api/featureflags';

const DEFAULT_HEADERS = {
  'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER
};

export const fetchFeatureFlags = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
  });

  return response.json();
};