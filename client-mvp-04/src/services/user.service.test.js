import getUser from './user.service';

const mockUserData = {
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

beforeEach(() => {
  fetch.resetMocks();
});

describe('UserService', () => {
  test('Should successfully fetch user data from API', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockUserData));
    const userData = await getUser('test@gmail.com');
    expect(userData).toMatchObject(mockUserData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/checkuser', {
      body: '{"email":"test@gmail.com"}',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': 'nAb3kY-S%qE#4!d',
      },
      method: 'POST',
    });
  });

  test('Should catch error and return null', async () => {
    fetch.mockReject(() => Promise.reject('User is not registered in the app'));
    const userData = await getUser('wrong.email@gmail.com');
    expect(userData).toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/checkuser', {
      body: '{"email":"wrong.email@gmail.com"}',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': 'nAb3kY-S%qE#4!d',
      },
      method: 'POST',
    });
  });
});
