/*** Mock userData for UserService ***/
export const mockUserData = {
  name: { firstName: 'Test', lastName: 'Person' },
  accessLevel: 'user',
  skillsToMatch: [],
  projects: [],
  textingOk: false,
  _id: '5f4bfbc8e9f4f121e8c1eb42',
  email: 'test@gmail.com',
  currentRole: 'College Student',
  desiredRole: 'Software Developer',
  newMember: false,
  attendanceReason: 'Environment',
  currentProject: 'VRMS',
  createdDate: '2020-11-11T03:48:46.153Z',
};

/***  Mock AUTH redux store state ***/
export const authDefaultState = {
  auth: {
    isLoaded: null,
    authToken: null,
    loggedIn: null,
    user: null,
    error: null,
    userProfile: null,
  },
};

// Access Level: 'user'
export const userAuthSuccessMockState = {
  auth: {
    ...authDefaultState,
    user: {
      name: { firstName: 'Test', lastName: 'Person' },
      accessLevel: 'user',
      skillsToMatch: [],
      projects: [],
      textingOk: false,
      _id: '5f4bfbc8e9f4f121e8c1eb42',
      email: 'test@gmail.com',
      currentRole: 'College Student',
      desiredRole: 'Software Developer',
      newMember: false,
      attendanceReason: 'Environment',
      currentProject: 'VRMS',
      createdDate: '2020-11-11T03:48:46.153Z',
    },
    userProfile: {
      firstName: 'Test',
      lastName: 'Person',
      signupEmail: 'test@gmail.com',
      isAdmin: false,
    },
    loggedIn: true,
  },
  dashboard: {
    isMenuOpen: true,
  },
};

export const userAuthFailMockState = {
  auth: {
    ...authDefaultState,
    loggedIn: false,
  },
  dashboard: {
    isMenuOpen: false,
  },
};
