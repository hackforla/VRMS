import React from 'react';
import {useHistory } from 'react-router-dom';

import ProjectForm from '../ProjectForm';
import ProjectApiService from '../../api/ProjectApiService';


function addProject() {
    // Array filled with default inputs.
    // const [newlyCreatedID, setNewlyCreatedID] = useState(null);

    const simpleInputs = [
        {
          label: 'Project Name',
          name: 'name',
          type: 'text',
          placeholder: 'Enter project name',
        },
        {
          label: 'Project Description',
          name: 'description',
          type: 'textarea',
          placeholder: 'Enter project description',
        },
        {
          label: 'Location',
          name: 'location',
          type: 'text',
          placeholder: 'Enter location for meeting',
          value: /https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/,
          errorMessage: 'Please enter a valid Zoom URL',
          addressValue: '',
          addressError: 'Invalid address'
      
        },
        // Leaving incase we want to add this back in for updating projects
        // {
        //   label: 'GitHub Identifier',
        //   name: 'githubIdentifier',
        //   type: 'text',
        //   placeholder: 'Enter GitHub identifier',
        // },
        {
          label: 'GitHub URL',
          name: 'githubUrl',
          type: 'text',
          placeholder: 'htttps://github.com/'
        },
        {
          label: 'Slack Channel Link',
          name: 'slackUrl',
          type: 'text',
          placeholder: 'htttps://slack.com/',
        },
        {
          label: 'Google Drive URL',
          name: 'googleDriveUrl',
          type: 'text',
          placeholder: 'htttps://drive.google.com/',
        },
        // Leaving incase we want to add this back in for updating projects
        // {
        //   label: 'HFLA Website URL',
        //   name: 'hflaWebsiteUrl',
        //   type: 'text',
        //   placeholder: 'htttps://hackforla.org/projects/',
        // },
      ];

   
     // Handles POST request found in api/ProjectApiService.
     const submitForm = async (data) => {
       const projectApi = new ProjectApiService();
       try {
         const id = await projectApi.create(data);
        //   console.log(id)
        //  setNewlyCreatedID(id);
        //  history.push(`/projects/${id}`)
        // projectView(id)
       } catch (errors) {
         console.error(errors);
         return;
       }
    //    setActiveButton('close');
     };

    //  const routeToNewProjectPage = () => {
    //     if(newlyCreatedID !== null) {
    //      history.push(`/projects/${newlyCreatedID}`)
    //    }
    //  }
     
    //  useEffect(() => {
    //     if(newlyCreatedID !== null) {
    //         history.push(`/projects/${newlyCreatedID}`)
    //       }
    //  },[newlyCreatedID])

  return (
    <div>
      <ProjectForm
        arr={simpleInputs}
        submitForm={submitForm}
        isEdit={false}
      />
    </div>
  )
}

export default addProject
