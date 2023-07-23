import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

class EventsApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
    };
    this.baseUrl = '/api/events/';
  }

  async fetchEvents() {
    try {
      const res = await fetch(this.baseUrl, {
        headers: this.headers,
      });
      return await res.json();
    } catch (error) {
      console.log(`fetchEvents error: ${error}`);
      alert('Server not responding.  Please refresh the page.');
      return [];
    }
  }

  async createNewEvent(eventToCreate) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(eventToCreate),
    };

    try {
      return await fetch(this.baseUrl, requestOptions);
    } catch (error) {
      console.error(`Add event error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }

  async deleteEvent(recurringEventID) {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers,
    };

    try {
      return await fetch(`${this.baseUrl}/${recurringEventID}`, requestOptions);
    } catch (error) {
      console.error(`Delete event error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }

  async updateEvent(eventToUpdate, eventID) {
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(eventToUpdate),
    };
    try {
      return await fetch(`${this.baseUrl}${eventID}`, requestOptions);
    } catch (error) {
      console.error(`Update event error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }
}

export default EventsApiService;
