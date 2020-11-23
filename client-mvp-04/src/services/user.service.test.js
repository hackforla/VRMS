import { checkUser, checkAuth, authUserWithToken } from './user.service';
import { CHECK_USER, SIGN_IN, AUTH_VERIFY_SIGN_IN } from '../utils/endpoints';

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
  describe('API call: checkUser(email)', () => {
    test('Should successfully fetch user data from API', async () => {
      fetch.mockResponseOnce(JSON.stringify(mockUserData));
      const userData = await checkUser('test@gmail.com');
      expect(userData).toMatchObject(mockUserData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(CHECK_USER, {
        body: '{"email":"test@gmail.com"}',
        headers: expect.anything(), // real value is not used because of environment variable presence
        method: 'POST',
      });
    });

    test('Should catch error and return null', async () => {
      fetch.mockReject(() =>
        Promise.reject('User is not registered in the app')
      );
      const userData = await checkUser('wrong.email@gmail.com');
      expect(userData).toEqual(null);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(CHECK_USER, {
        body: '{"email":"wrong.email@gmail.com"}',
        headers: expect.anything(), // real value is not used because of environment variable presence
        method: 'POST',
      });
    });
  });

  describe('API call: checkAuth(email)', () => {
    test('Should return status 200', async () => {
      fetch.mockResponseOnce();
      const response = await checkAuth('test@gmail.com');
      expect(response).toBeTruthy();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(SIGN_IN, {
        body: '{"email":"test@gmail.com"}',
        headers: expect.anything(), // real value is not used because of environment variable presence
        method: 'POST',
      });
    });

    test('Should catch error and return null', async () => {
      fetch.mockReject(() => Promise.reject('User is not authorized in app'));
      const userData = await checkAuth('wrong.email@gmail.com');
      expect(userData).toEqual(null);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(SIGN_IN, {
        body: '{"email":"wrong.email@gmail.com"}',
        headers: expect.anything(), // real value is not used because of environment variable presence
        method: 'POST',
      });
    });
  });

  describe('API call: authUserWithToken(token)', () => {
    test('Should successfully authorize user with token and return user', async () => {
      fetch.mockResponseOnce(JSON.stringify(mockUserData));
      const user = await authUserWithToken('testToken');
      expect(user).toMatchObject(mockUserData);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(AUTH_VERIFY_SIGN_IN, {
        headers: expect.anything(), // real value is not used because of environment variable presence
        method: 'POST',
      });
    });

    test('Should catch error and return null', async () => {
      fetch.mockReject(() =>
        Promise.reject('User is not authorized with token')
      );
      const user = await authUserWithToken('testToken');
      expect(user).toEqual(null);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(AUTH_VERIFY_SIGN_IN, {
        headers: expect.anything(), // real value is not used because of environment variable presence
        method: 'POST',
      });
    });
  });
});
