import React from 'react';
import ProjectForm from '../ProjectForm';

function addProject() {
  // Array filled with default inputs.
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
      value: /^[a-zA-Z0-9].{0,250}$/,
      errorMessage: 'Description must start with alphanumeric characters, 250 char limit'
    },
    {
      label: 'Location',
      name: 'location',
      type: 'text',
      placeholder: 'Enter location for meeting',
      value: /https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/,
      errorMessage: 'Please enter a valid Zoom URL',
      addressValue: '',
      addressError: 'Invalid address',
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
      placeholder: 'htttps://github.com/',
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

  return (
    <div>
      <ProjectForm
        arr={simpleInputs}
        formData={null}
        handleChange={null}
        isEdit={false}
      />
    </div>
  );
}

export default addProject;
