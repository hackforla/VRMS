// Mock userData for UserService
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

// Mock auth redux store state
export const authDefaultState = {
  auth: {
    isLoaded: null,
    authToken: null,
    loggedIn: null,
    user: null,
    error: null,
  },
};

export const userMockState = {
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
    loggedIn: true,
  },
};
