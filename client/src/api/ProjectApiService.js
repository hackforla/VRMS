import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

class ProjectApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'x-customrequired-header': REACT_APP_CUSTOM_REQUEST_HEADER,
    };
    this.baseProjectUrl = '/api/projects/';
  }

  async fetchProjects() {
    try {
      const res = await fetch(this.baseProjectUrl, {
        headers: this.headers,
      });
      return await res.json();
    } catch (error) {
      console.error(`fetchProjects error: ${error}`);
      alert('Server not responding.  Please refresh the page.');
      return [];
    }
  }

  async addProjectToDb(newProjectName) {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ name: newProjectName, projectStatus: 'Active' }),
    };

    try {
      return await fetch(this.baseProjectUrl, requestOptions);
    } catch (error) {
      console.error(`Add project error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }
}

export default ProjectApiService;
