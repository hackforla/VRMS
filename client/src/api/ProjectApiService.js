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

  async create(projectData) {
    const {
      name,
      description,
      location,
      githubIdentifier,
      githubUrl,
      slackUrl,
      googleDriveUrl,
      hflaWebsiteUrl,
    } = projectData;
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        description: description,
        location: location,
        githubIdentifier: githubIdentifier,
        githubUrl: githubUrl,
        slackUrl: slackUrl,
        googleDriveUrl: googleDriveUrl,
        hflaWebsiteUrl: hflaWebsiteUrl,
        projectStatus: 'Active',
      }),
    };

    console.log('THIS BASEPROJECT URL', this.baseProjectUrl);

    try {
      const proj = await fetch(this.baseProjectUrl, requestOptions);
      const projectDetails = await proj.json();
      return projectDetails._id;
    } catch (error) {
      console.error(`Add project error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }

  async updateProject(projectId, projectData) {
    // Update database
    const url = `${this.baseProjectUrl}${projectId}`;
    const requestOptions = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ ...projectData }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const resJson = await response.json();
      return resJson;
    } catch (error) {
      console.log(`update project error: `, error);
      alert('Server not responding.  Please try again.');
      return undefined;
    }
  }
}

export default ProjectApiService;
