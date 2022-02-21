import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

class RecurringEventsApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
    };
    this.baseUserUrl = '/api/recurringEvents/';
  }

  async fetchRecurringEvents() {
    try {
      const res = await fetch(this.baseUserUrl, {
        headers: this.headers,
      });
      return await res.json();
    } catch (error) {
      console.log(`fetchRecurringEvents error: ${error}`);
      alert('Server not responding.  Please refresh the page.');
      return [];
    }
  }
}

export default RecurringEventsApiService;
