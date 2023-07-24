import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

class UserApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
    };
    this.baseUserUrl = '/api/users/';
  }

  async fetchUsers() {
    try {
      const res = await fetch(this.baseUserUrl, {
        headers: this.headers,
      });
      return await res.json();
    } catch (error) {
      console.error(`fetchUsers error: ${error}`);
      alert('Server not responding.  Please refresh the page.');
    }
    return [];
  }

  // Updates user projects in db
  async updateUserDbProjects(userToEdit, managedProjects) {
    // eslint-disable-next-line no-underscore-dangle
    const url = `${this.baseUserUrl}${userToEdit._id}`;
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ managedProjects }),
    };

    try {
      return await fetch(url, requestOptions);
    } catch (error) {
      console.log(`update user error: `, error);
      alert('Server not responding.  Please try again.');
    }
    return undefined;
  }

  async updateUserDbIsActive(userToEdit, isActive) {
    const url = `${this.baseUserUrl}${userToEdit._id}`;
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({isActive})
    }

    try {
      return await fetch(url, requestOptions);
    } catch(err) {
      console.error('update is-active error', err)
      alert('server not responding.  Please try again.');
    }
  }
}

export default UserApiService;
