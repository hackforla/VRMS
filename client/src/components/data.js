// Array filled with default inputs.
export const simpleInputs = [
  {
    label: 'Project Name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter project name',
    disabled: false
  },
  {
    label: 'Project Description',
    name: 'description',
    type: 'textarea',
    placeholder: 'Enter project description',
    value: /^[a-zA-Z0-9].{0,250}$/,
    errorMessage: 'Description must start with alphanumeric characters, 250 char limit',
    disabled: false
  },
  //this feature is commented out as per the PR #1567
  // {
  //   label: 'Location',
  //   name: 'location',
  //   type: 'text',
  //   placeholder: 'Enter location for meeting',
  //   value: /https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/,
  //   errorMessage: 'Please enter a valid Zoom URL',
  //   addressValue: '',
  //   addressError: 'Invalid address',
  //   disabled: false
  // },
  {
    label: 'GitHub Identifier',
    name: 'githubIdentifier',
    type: 'text',
    placeholder: 'Enter GitHub identifier',
    disabled: false
  },
  {
    label: 'GitHub URL',
    name: 'githubUrl',
    type: 'text',
    placeholder: 'https://github.com/',
    disabled: false
  },
  {
    label: 'Slack Channel Link',
    name: 'slackUrl',
    type: 'text',
    placeholder: 'https://slack.com/',
    disabled: false
  },
  {
    label: 'Google Drive URL',
    name: 'googleDriveUrl',
    type: 'text',
    placeholder: 'https://drive.google.com/',
    disabled: false,
    required: true,
    pattern: /^https:\/\/drive\.google\.com\/.+$/, 
    errorMessage: 'Invalid Google Drive URL'
  },
  {
    label: 'HFLA Website URL',
    name: 'hflaWebsiteUrl',
    type: 'text',
    placeholder: 'https://hackforla.org/projects/',
    disabled: false,
    required: false
  },
];

export const additionalInputsForEdit = [
  // this feature is commented out as per the PR #1577
  // {
  //   label: 'Partners',
  //   name: 'partners',
  //   type: 'text',
  //   placeholder: 'partners',
  //   disabled: false
  // },
  // {
  //   label: 'Managed by Users',
  //   name: 'managedByUsers',
  //   type: 'text',
  //   placeholder: 'Managed by Users',
  //   disabled: false
  // },
  // {
  //   label: 'Project Status',
  //   name: 'projectStatus',
  //   type: 'text',
  //   placeholder: 'Project Status',
  //   disabled: false
  // },
  // Comment out as per the PR #1584
  //  {
  //   label: 'Google Drive ID',
  //   name: 'googleDriveId',
  //   type: 'text',
  //   placeholder: 'htttps://drive.google.com/',
  //   disabled: false,
  //   required: false
  // },
  // this feature is commented out as per the PR #1577
  // {
  //   label: 'Created Date',
  //   name: 'createdDate',
  //   type: 'text',
  //   placeholder: 'Created Date',
  //   disabled: true
  // }
]