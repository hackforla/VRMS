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
    {
      label: 'GitHub Identifier',
      name: 'githubIdentifier',
      type: 'text',
      placeholder: 'Enter GitHub identifier',
    },
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
    {
      label: 'HFLA Website URL',
      name: 'hflaWebsiteUrl',
      type: 'text',
      placeholder: 'htttps://hackforla.org/projects/',
    },
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
