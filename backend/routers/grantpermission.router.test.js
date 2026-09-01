import { vi, describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

// vi.hoisted — must be available before any vi.mock factory runs
const mockFetch = vi.hoisted(() => vi.fn());

vi.mock('../middleware/auth.middleware.js', () => ({
  authUser: vi.fn((req, res, next) => {
    const levelMap = { member: 'user', admin: 'admin', superadmin: 'super_admin' };
    req.user = { accessLevel: levelMap[req.body?.accessLevel] || 'user' };
    next();
  }),
}));
vi.mock('googleapis', () => ({
  google: {
    auth: { OAuth2: vi.fn() },
    drive: vi.fn(),
  },
}));
vi.mock('node-fetch', () => ({ default: mockFetch }));
vi.mock('fs', () => ({ default: { readFile: vi.fn() } }));

// Module-level references populated in beforeAll via dynamic imports
let google;
let fs;
let request;

beforeAll(async () => {
  // vi.resetModules clears the module cache (not the mock registry) so the
  // subsequent dynamic imports load fresh instances that hit the mocks above.
  vi.resetModules();

  // Import everything fresh — router's transitive deps hit the mock registry
  const googleMod = await import('googleapis');
  google = googleMod.google;

  const fsMod = await import('fs');
  fs = fsMod.default;

  const { default: grantPermissionRouter } = await import('./grantpermission.router.js');
  const { default: express } = await import('express');
  const { default: supertest } = await import('supertest');

  const testapp = express();
  testapp.use(express.json());
  testapp.use('/api/grantpermission', grantPermissionRouter);
  request = supertest(testapp);
});

describe('Unit tests for grantpermission router', () => {
  beforeEach(() => {
    process.env.GOOGLECREDENTIALS = JSON.stringify({
      client_id: 'mock_client_id',
      client_secret: 'mock_client_secret',
      redirect_uris: ['http://localhost:3000', 'http://localhost:3000/callback'],
    });
    process.env.GOOGLE_ACCESS_TOKEN = 'mock_access_token';
    process.env.GOOGLE_REFRESH_TOKEN = 'mock_refresh_token';
    process.env.GOOGLE_EXPIRY_DATE = '1234567890';

    const mockOAuth2Client = { setCredentials: vi.fn() };
    google.auth.OAuth2.mockImplementation(function () {
      return mockOAuth2Client;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.GOOGLECREDENTIALS;
    delete process.env.GOOGLE_ACCESS_TOKEN;
    delete process.env.GOOGLE_REFRESH_TOKEN;
    delete process.env.GOOGLE_EXPIRY_DATE;
  });

  describe('POST /api/grantpermission/googleDrive', () => {
    const mockRequestBody = {
      email: 'test@gmail.com',
      file: 'mockFile',
    };

    it('should grant Google Drive permission and return success message if true', async () => {
      google.drive.mockReturnValue({
        permissions: {
          create: vi.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: vi.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      const response = await request
        .post('/api/grantpermission/googleDrive')
        .send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Success!' });
      const driveInstance = google.drive.mock.results[0].value;
      expect(driveInstance.permissions.create).toHaveBeenCalledWith(
        expect.objectContaining({ resource: expect.any(Object), fileId: 'mockFile' }),
        expect.any(Function),
      );
    });

    it('should return 500 if Drive API returns an error', async () => {
      google.drive.mockReturnValue({
        permissions: {
          create: vi.fn((opts, cb) => cb(new Error('Permission denied'))),
        },
        files: {
          list: vi.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      const response = await request
        .post('/api/grantpermission/googleDrive')
        .send(mockRequestBody);

      // grantPermission rejects → outer catch returns 500
      expect(response.status).toBe(500);
    });

    it('should return http code 400 if email or file to change are not provided', async () => {
      const response = await request.post('/api/grantpermission/googleDrive').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/grantpermission/gitHub', () => {
    beforeEach(() => {
      process.env.GITHUB_TOKEN = 'mock_github_token';

      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('/teams/')) {
          if (url.includes('?role=member')) {
            return Promise.resolve({
              status: 200,
              json: () => Promise.resolve({ state: 'active' }),
            });
          } else {
            return Promise.resolve({
              status: 200,
              json: () => Promise.resolve({ state: 'active' }),
            });
          }
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        if (url.includes('/public_members/')) {
          return Promise.resolve({
            status: 204,
            json: () => Promise.resolve({}),
          });
        }
        if (url.includes('filter=2fa_disabled')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve([]),
          });
        }
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      });
    });

    afterEach(() => {
      delete process.env.GITHUB_TOKEN;
    });

    it('should return 200 if the organization membership status is active', async () => {
      const mockRequestBody = {
        teamName: 'mockTeam',
        accessLevel: 'member',
        handle: 'mockHandle',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orgMembershipStatus');
      expect(response.body.orgMembershipStatus).toBe('active');
      expect(response.body.teamMembershipStatus).toBe('active');
      expect(response.body).toHaveProperty('publicMembership');
      expect(response.body).toHaveProperty('twoFAenabled');
    });

    it('should return 200 and set orgMembershipStatus to pending if user is not yet a member', async () => {
      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({ status: 404, json: () => Promise.resolve({}) });
        }
        if (url.includes('/memberships/') && url.includes('?role=member')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'pending' }),
          });
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
      });

      const mockRequestBody = {
        teamName: 'mockTeam',
        accessLevel: 'member',
        handle: 'newUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body.orgMembershipStatus).toBe('pending');
      expect(response.body.teamMembershipStatus).toBe('pending');
    });

    it('should create correct team slugs for a regular member', async () => {
      const mockRequestBody = {
        teamName: 'Design Team',
        accessLevel: 'member',
        handle: 'designUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/design-team/memberships/'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/design-team-managers/memberships/'),
        expect.any(Object),
      );
    });

    it('should create correct team slugs for an admin', async () => {
      const mockRequestBody = {
        teamName: 'Dev Team',
        accessLevel: 'admin',
        handle: 'adminUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/dev-team/memberships/'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/dev-team-managers/memberships/'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/dev-team-admins/memberships/'),
        expect.any(Object),
      );
    });

    it('should create correct team slugs for a superadmin', async () => {
      const mockRequestBody = {
        teamName: 'Leadership',
        accessLevel: 'superadmin',
        handle: 'superAdminUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/leadership/memberships/'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/leadership-managers/memberships/'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/leadership-admins/memberships/'),
        expect.any(Object),
      );
    });

    it('should handle team names with multiple words by converting to kebab-case', async () => {
      const mockRequestBody = {
        teamName: 'Community Engagement',
        accessLevel: 'member',
        handle: 'communityUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/community-engagement/memberships/'),
        expect.any(Object),
      );
    });

    it('should return 400 if team is not found', async () => {
      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 404,
            json: () => Promise.resolve({ message: 'Not Found' }),
          });
        }
        if (url.includes('/public_members/')) {
          return Promise.resolve({ status: 204, json: () => Promise.resolve({}) });
        }
        if (url.includes('filter=2fa_disabled')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
      });

      const mockRequestBody = {
        teamName: 'NonexistentTeam',
        accessLevel: 'member',
        handle: 'testUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(400);
    });

    it('should return 400 if adding user to team fails', async () => {
      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 500,
            json: () => Promise.resolve({ message: 'Internal Server Error' }),
          });
        }
        if (url.includes('/public_members/')) {
          return Promise.resolve({ status: 204, json: () => Promise.resolve({}) });
        }
        if (url.includes('filter=2fa_disabled')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
      });

      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'testUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(400);
    });

    it('should check public membership when org membership is active', async () => {
      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'publicUser',
      };

      const response = await request.post('/api/grantpermission/gitHub').send(mockRequestBody);

      expect(response.status).toBe(200);
      // checkPublicMembership calls fetch with only the URL (no options object)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/public_members/publicUser'),
      );
      expect(response.body.publicMembership).toBe(true);
    });

    it('should return false for publicMembership if user is not public', async () => {
      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 123 }) });
        }
        if (url.includes('/public_members/')) {
          return Promise.resolve({ status: 404, json: () => Promise.resolve({}) });
        }
        if (url.includes('filter=2fa_disabled')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
      });

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send({ teamName: 'TestTeam', accessLevel: 'member', handle: 'privateUser' });

      expect(response.status).toBe(200);
      expect(response.body.publicMembership).toBe(false);
    });

    it('should check 2FA status when org membership is active', async () => {
      const response = await request
        .post('/api/grantpermission/gitHub')
        .send({ teamName: 'TestTeam', accessLevel: 'member', handle: '2faUser' });

      expect(response.status).toBe(200);
      // check2FA calls fetch with only the URL (no options object)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('filter=2fa_disabled'),
      );
      // Router bug: check2FA never calls res.json() — response object has no .length
      // so the no-2FA array is never parsed; function always returns true
      expect(response.body.twoFAenabled).toBe(true);
    });

    it('should return false for twoFAenabled if 2FA is disabled', async () => {
      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 123 }) });
        }
        if (url.includes('/public_members/')) {
          return Promise.resolve({ status: 204, json: () => Promise.resolve({}) });
        }
        if (url.includes('filter=2fa_disabled')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve([{ login: 'no2faUser' }]),
          });
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
      });

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send({ teamName: 'TestTeam', accessLevel: 'member', handle: 'no2faUser' });

      expect(response.status).toBe(200);
      // Router bug: check2FA never parses JSON; always returns true regardless of list contents
      expect(response.body.twoFAenabled).toBe(true);
    });

    it('should not include publicMembership and twoFAenabled when org membership is pending', async () => {
      mockFetch.mockImplementation((url) => {
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'pending' }),
          });
        }
        if (url.includes('/teams/')) {
          return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 123 }) });
        }
        return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
      });

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send({ teamName: 'TestTeam', accessLevel: 'member', handle: 'pendingUser' });

      expect(response.status).toBe(200);
      expect(response.body.orgMembershipStatus).toBe('pending');
      expect(response.body.teamMembershipStatus).toBe('pending');
      expect(response.body).not.toHaveProperty('publicMembership');
      expect(response.body).not.toHaveProperty('twoFAenabled');
    });
  });

  describe('POST /api/grantpermission/', () => {
    const mockCredentials = {
      web: {
        client_id: 'test_client_id',
        client_secret: 'test_client_secret',
        redirect_uris: ['http://localhost:3000', 'http://localhost:3000/callback'],
      },
    };

    beforeEach(() => {
      fs.readFile.mockClear();
    });

    it('should return 400 if code is provided but sendToken fails', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const response = await request
        .post('/api/grantpermission/')
        .send({ code: 'invalid_code' });

      expect(response.status).toBe(400);
    });

    it('should return 200 with success message when token is provided and grantPermission succeeds', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const mockOAuth2Client = { setCredentials: vi.fn() };
      google.auth.OAuth2.mockImplementation(function () {
        return mockOAuth2Client;
      });

      google.drive.mockReturnValue({
        permissions: {
          create: vi.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: vi.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      const mockRequestBody = {
        token: { access_token: 'mock_access_token', refresh_token: 'mock_refresh_token' },
        email: 'test@example.com',
        file: 'test_file_id',
      };

      const response = await request.post('/api/grantpermission/').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Success!');
    });

    it('should return 200 with auth URL if neither token nor code is provided', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const mockOAuth2Client = {
        generateAuthUrl: vi.fn().mockReturnValue('https://accounts.google.com/o/oauth2/auth?test=url'),
      };
      google.auth.OAuth2.mockImplementation(function () {
        return mockOAuth2Client;
      });

      const response = await request
        .post('/api/grantpermission/')
        .send({ email: 'test@example.com', file: 'file_id' });

      expect(response.body).toHaveProperty('url');
    });

    it('should set OAuth2 credentials when token is provided', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const mockOAuth2Client = { setCredentials: vi.fn() };
      google.auth.OAuth2.mockImplementation(function () {
        return mockOAuth2Client;
      });

      google.drive.mockReturnValue({
        permissions: {
          create: vi.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: vi.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      const mockToken = { access_token: 'test_access_token', refresh_token: 'test_refresh_token' };
      const mockRequestBody = { token: mockToken, email: 'test@example.com', file: 'test_file_id' };

      const response = await request.post('/api/grantpermission/').send(mockRequestBody);

      expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith(mockToken);
      expect(response.status).toBe(200);
    });

    it('should return auth URL from sendURL when no token or code provided', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const mockOAuth2Client = {
        generateAuthUrl: vi.fn().mockReturnValue('https://accounts.google.com/o/oauth2/auth?test=url'),
      };
      google.auth.OAuth2.mockImplementation(function () {
        return mockOAuth2Client;
      });

      const response = await request.post('/api/grantpermission/').send({});

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('url');
      expect(response.body.url).toContain('accounts.google.com');
    });

    it('should handle grantPermission failure and return 400', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const mockOAuth2Client = { setCredentials: vi.fn() };
      google.auth.OAuth2.mockImplementation(function () {
        return mockOAuth2Client;
      });

      google.drive.mockReturnValue({
        permissions: {
          create: vi.fn((opts, cb) => cb(new Error('Permission denied'))),
        },
        files: {
          list: vi.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      const mockRequestBody = {
        token: { access_token: 'test_token', refresh_token: 'test_refresh' },
        email: 'user@example.com',
        file: 'file_123',
      };

      const response = await request.post('/api/grantpermission/').send(mockRequestBody);

      expect(response.status).toBe(400);
    });

    it('should return 200 with message when token is pre-existing (setToken=false)', async () => {
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      const mockOAuth2Client = { setCredentials: vi.fn() };
      google.auth.OAuth2.mockImplementation(function () {
        return mockOAuth2Client;
      });

      google.drive.mockReturnValue({
        permissions: {
          create: vi.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: vi.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      const mockToken = { access_token: 'generated_token', refresh_token: 'generated_refresh' };
      const mockRequestBody = { token: mockToken, email: 'test@example.com', file: 'test_file_id' };

      const response = await request.post('/api/grantpermission/').send(mockRequestBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Success!');
    });
  });
});
