// Array filled with default inputs.
export const simpleInputs = [
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
    errorMessage:
      'Description must start with alphanumeric characters, 250 char limit',
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
    placeholder: 'https://github.com/',
  },
  {
    label: 'Slack Channel Link',
    name: 'slackUrl',
    type: 'text',
    placeholder: 'https://slack.com/',
  },
  {
    label: 'Google Drive URL',
    name: 'googleDriveUrl',
    type: 'text',
    placeholder: 'https://drive.google.com/',
    validate: function (value) {
      return value.startsWith('https://drive.google.com/');
    },
  },
  {
    label: 'HFLA Website URL',
    name: 'hflaWebsiteUrl',
    type: 'text',
    placeholder: 'https://hackforla.org/projects/',
  },
];
