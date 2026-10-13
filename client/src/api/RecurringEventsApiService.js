import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

class RecurringEventsApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
    };
    this.baseUrl = '/api/recurringEvents/';
  }

  async fetchRecurringEvents() {
    try {
      const res = await fetch(`${this.baseUrl}/internal`, {
        headers: this.headers,
      });
      return await res.json();
    } catch (error) {
      console.log(`fetchRecurringEvents error: ${error}`);
      alert('Server not responding.  Please refresh the page.');
      return [];
    }
  }

  async createNewRecurringEvent(eventToCreate) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(eventToCreate),
    };

    try {
      return await fetch(this.baseUrl, requestOptions);
    } catch (error) {
      console.error(`Add recurring event error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }

  async deleteRecurringEvent(recurringEventID) {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers,
    };

    try {
      return await fetch(`${this.baseUrl}/${recurringEventID}`, requestOptions);
    } catch (error) {
      console.error(`Delete recurring event error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }

  async updateRecurringEvent(eventToUpdate, recurringEventID) {
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(eventToUpdate),
    };
    try {
      return await fetch(`${this.baseUrl}/${recurringEventID}`, requestOptions);
    } catch (error) {
      console.error(`Update recurring event error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }
}

export default RecurringEventsApiService;
