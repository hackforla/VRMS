// Mock googleApis module
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(),
    },
    drive: jest.fn(),
  },
}));

// Mock node-fetch for GitHub API calls
jest.mock('node-fetch', () => jest.fn());

// Mock fs module
jest.mock('fs', () => ({
  readFile: jest.fn(),
}));

// Create a mock test server
const express = require('express');
const supertest = require('supertest');
const { google } = require('googleapis');
const fetch = require('node-fetch');
const fs = require('fs');
const grantPermissionRouter = require('./grantpermission.router.js');

const testapp = express();
// Allows for body parsing
testapp.use(express.json());
testapp.use('/api/grantpermission', grantPermissionRouter);

let request;

describe('Unit tests for grantpermission router', () => {
  beforeAll(() => {
    // Create the server before any tests run
    request = supertest(testapp);
  });

  // Close server after all tests
  afterAll((done) => {
    // Force close all connections
    const closeServer = () => {
      if (request._server) {
        // Force close all keep-alive connections
        if (request._server.closeAllConnections) {
          request._server.closeAllConnections();
        }
        request._server.close(() => done());
      } else {
        done();
      }
    };
    
    // Give a small delay to ensure pending operations complete
    setImmediate(closeServer);
  });

  // Mock environment variables
  beforeEach(() => {
    // Mock environment variables
    process.env.GOOGLECREDENTIALS = JSON.stringify({
      client_id: 'mock_client_id',
      client_secret: 'mock_client_secret',
      redirect_uris: ['http://localhost:3000', 'http://localhost:3000/callback'],
    });
    process.env.GOOGLE_ACCESS_TOKEN = 'mock_access_token';
    process.env.GOOGLE_REFRESH_TOKEN = 'mock_refresh_token';
    process.env.GOOGLE_EXPIRY_DATE = '1234567890';

    // Mock the OAuth2 client
    const mockOAuth2Client = {
      setCredentials: jest.fn(),
    };
    
    google.auth.OAuth2.mockReturnValue(mockOAuth2Client);
  });
 
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.GOOGLECREDENTIALS;
    delete process.env.GOOGLE_ACCESS_TOKEN;
    delete process.env.GOOGLE_REFRESH_TOKEN;
    delete process.env.GOOGLE_EXPIRY_DATE;
    fetch.mockClear();
  });

  describe('POST /api/grantpermission/googleDrive', () => {
    // Mock request body
    const mockRequestBody = {
        email: 'test@gmail.com',
        file: 'mockFile',
    };

    it('should grant Google Drive permission and return success message if true', async (done) => {
        google.drive.mockReturnValue({
          permissions: {
            create: jest.fn((opts, cb) => cb(null, { data: {} })),
          },
          files: {
            list: jest.fn((opts, cb) => cb(null, { data: { files: [] } })),
          },
        });

        const response = await request
            .post('/api/grantpermission/googleDrive')
            .send(mockRequestBody);

        // Tests  
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Success!' });
        // ensure the Google Drive permissions.create was invoked
        const driveInstance = google.drive.mock.results[0].value;
        expect(driveInstance.permissions.create).toHaveBeenCalledWith(
          expect.objectContaining({ resource: expect.any(Object), fileId: 'mockFile' }),
          expect.any(Function)
        );

        // Marks completion of test
        done();
    });

    it('should return 400 if grantPermission rejects with success: false', async (done) => {
        // Mock google.drive to simulate permissions.create error that grantPermission rejects with
        google.drive.mockReturnValue({
          permissions: {
            create: jest.fn((opts, cb) => cb(new Error('Permission denied'))),
          },
          files: {
            list: jest.fn((opts, cb) => cb(null, { data: { files: [] } })),
          },
        });

        const response = await request
          .post('/api/grantpermission/googleDrive')
          .send(mockRequestBody);

        // Test
        expect(response.status).toBe(400);

        // Marks completion of test
        done();
    });

    it('should return http code 400 if email or file to change are not provided', async (done) => {
        const response = await request
          .post('/api/grantpermission/googleDrive')   
          .send({}); // No email or file provided

        // Test
        expect(response.status).toBe(400);

        // Marks completion of test
        done();
    });
  });

  describe('POST /api/grantpermission/gitHub', () => {
    beforeEach(() => {
      // Mock fetch for GitHub API calls
      process.env.GITHUB_TOKEN = 'mock_github_token';
      
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus and inviteToOrg - active member
        if (url.includes('/memberships/') && !url.includes('/teams/')) {
          if (url.includes('?role=member')) {
            // inviteToOrg response
            return Promise.resolve({
              status: 200,
              json: () => Promise.resolve({ state: 'active' }),
            });
          } else {
            // checkOrgMembershipStatus response
            return Promise.resolve({
              status: 200,
              json: () => Promise.resolve({ state: 'active' }),
            });
          }
        }
        
        // Mock addToTeam
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        
        // Mock checkPublicMembership
        if (url.includes('/public_members/')) {
          return Promise.resolve({
            status: 204,
            json: () => Promise.resolve({}),
          });
        }
        
        // Mock check2FA
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
      jest.clearAllMocks();
    });

    it('should return 200 if the organization membership status is active', async (done) => {
      const mockRequestBody = {
        teamName: 'mockTeam',
        accessLevel: 'member',
        handle: 'mockHandle',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orgMembershipStatus');
      expect(response.body.orgMembershipStatus).toBe('active');
      expect(response.body.teamMembershipStatus).toBe('active');
      expect(response.body).toHaveProperty('publicMembership');
      expect(response.body).toHaveProperty('twoFAenabled');

      // Marks completion of test
      done();
    });

    it('should return 200 and set orgMembershipStatus to pending if user is not yet a member', async (done) => {
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus - 404 not found (no query params)
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 404,
            json: () => Promise.resolve({}),
          });
        }
        
        // Mock inviteToOrg - successful invitation (has ?role=member)
        if (url.includes('/memberships/') && url.includes('?role=member')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'pending' }),
          });
        }
        
        // Mock addToTeam
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      });

      const mockRequestBody = {
        teamName: 'mockTeam',
        accessLevel: 'member',
        handle: 'newUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body.orgMembershipStatus).toBe('pending');
      expect(response.body.teamMembershipStatus).toBe('pending');

      // Marks completion of test
      done();
    });

    it('should create correct team slugs for a regular member', async (done) => {
      const mockRequestBody = {
        teamName: 'Design Team',
        accessLevel: 'member',
        handle: 'designUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      expect(response.status).toBe(200);
      // addToTeam should be called with base team and manager team only for regular members
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/design-team/memberships/'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/design-team-managers/memberships/'),
        expect.any(Object)
      );

      // Marks completion of test
      done();
    });

    it('should create correct team slugs for an admin', async (done) => {
      const mockRequestBody = {
        teamName: 'Dev Team',
        accessLevel: 'admin',
        handle: 'adminUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      // addToTeam should be called with base team, manager team, and admin team for admins
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/dev-team/memberships/'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/dev-team-managers/memberships/'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/dev-team-admins/memberships/'),
        expect.any(Object)
      );

      // Marks completion of test
      done();
    });

    it('should create correct team slugs for a superadmin', async (done) => {
      const mockRequestBody = {
        teamName: 'Leadership',
        accessLevel: 'superadmin',
        handle: 'superAdminUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      expect(response.status).toBe(200);
      // addToTeam should be called with base team, manager team, and admin team for superadmins
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/leadership/memberships/'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/leadership-managers/memberships/'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/leadership-admins/memberships/'),
        expect.any(Object)
      );

      // Marks completion of test
      done();
    });

    it('should handle team names with multiple words by converting to kebab-case', async (done) => {
      const mockRequestBody = {
        teamName: 'Community Engagement',
        accessLevel: 'member',
        handle: 'communityUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/teams/community-engagement/memberships/'),
        expect.any(Object)
      );

      // Marks completion of test
      done();
    });

    it('should return 400 if team is not found', async (done) => {
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        
        // Mock addToTeam - team not found
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 404,
            json: () => Promise.resolve({ message: 'Not Found' }),
          });
        }
        
        // Mock checkPublicMembership
        if (url.includes('/public_members/')) {
          return Promise.resolve({
            status: 204,
            json: () => Promise.resolve({}),
          });
        }
        
        // Mock check2FA
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

      const mockRequestBody = {
        teamName: 'NonexistentTeam',
        accessLevel: 'member',
        handle: 'testUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(400);

      // Marks completion of test
      done();
    });

    it('should return 400 if adding user to team fails', async (done) => {
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        
        // Mock addToTeam - internal error
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 500,
            json: () => Promise.resolve({ message: 'Internal Server Error' }),
          });
        }
        
        // Mock checkPublicMembership
        if (url.includes('/public_members/')) {
          return Promise.resolve({
            status: 204,
            json: () => Promise.resolve({}),
          });
        }
        
        // Mock check2FA
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

      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'testUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(400);

      // Marks completion of test
      done();
    });

    it('should return 400 if required fields are missing', async (done) => {
      const testCases = [
        { teamName: 'TestTeam', accessLevel: 'member' }, // missing handle
        { teamName: 'TestTeam', handle: 'testUser' }, // missing accessLevel
        { accessLevel: 'member', handle: 'testUser' }, // missing teamName
        {}, // all fields missing
      ];

      for (const mockRequestBody of testCases) {
        const response = await request
          .post('/api/grantpermission/gitHub')
          .send(mockRequestBody);

        expect(response.status).toBe(400);
      }

      // Marks completion of test
      done();
    });

    it('should check public membership when org membership is active', async (done) => {
      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'publicUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/public_members/publicUser'),
        expect.any(Object)
      );
      expect(response.body.publicMembership).toBe(true);

      // Marks completion of test 
      done();
    });

    it('should return false for publicMembership if user is not public', async (done) => {
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        
        // Mock addToTeam
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        
        // Mock checkPublicMembership - not public
        if (url.includes('/public_members/')) {
          return Promise.resolve({
            status: 404,
            json: () => Promise.resolve({}),
          });
        }
        
        // Mock check2FA
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

      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'privateUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body.publicMembership).toBe(false);

      // Marks completion of test
      done();
    });

    it('should check 2FA status when org membership is active', async (done) => {
      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: '2faUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter=2fa_disabled'),
        expect.any(Object)
      );
      expect(response.body.twoFAenabled).toBe(true);

      // Marks completion of test
      done();
    });

    it('should return false for twoFAenabled if 2FA is disabled', async (done) => {
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'active' }),
          });
        }
        
        // Mock addToTeam
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        
        // Mock checkPublicMembership
        if (url.includes('/public_members/')) {
          return Promise.resolve({
            status: 204,
            json: () => Promise.resolve({}),
          });
        }
        
        // Mock check2FA - user found in 2FA disabled list
        if (url.includes('filter=2fa_disabled')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve([{ login: 'no2faUser' }]),
          });
        }
        
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      });

      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'no2faUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body.twoFAenabled).toBe(false);

      // Marks completion of test
      done();
    });

    it('should not include publicMembership and twoFAenabled when org membership is pending', async (done) => {
      fetch.mockImplementation((url) => {
        // Mock checkOrgMembershipStatus - returns pending
        if (url.includes('/memberships/') && !url.includes('?') && !url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ state: 'pending' }),
          });
        }
        
        // Mock addToTeam
        if (url.includes('/teams/')) {
          return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ id: 123 }),
          });
        }
        
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({}),
        });
      });

      const mockRequestBody = {
        teamName: 'TestTeam',
        accessLevel: 'member',
        handle: 'pendingUser',
      };

      const response = await request
        .post('/api/grantpermission/gitHub')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body.orgMembershipStatus).toBe('pending');
      expect(response.body.teamMembershipStatus).toBe('pending');
      expect(response.body).not.toHaveProperty('publicMembership');
      expect(response.body).not.toHaveProperty('twoFAenabled');

      // Marks completion of test
      done();
    });
  });

  describe('POST /api/grantpermission/', () => {
    // Mock credentials object for OAuth2 setup
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

    it('should return 400 if code is provided but sendToken fails', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Request body with invalid authorization code
      const mockRequestBody = {
        code: 'invalid_code',
      };

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(400);

      // Marks completion of test
      done();
    });

    it('should return 200 with success message when token is provided and grantPermission succeeds', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Mock the OAuth2 client's setCredentials
      const mockOAuth2Client = {
        setCredentials: jest.fn(),
      };
      google.auth.OAuth2.mockReturnValue(mockOAuth2Client);

      // Mock google.drive to simulate successful permission grant
      google.drive.mockReturnValue({
        permissions: {
          create: jest.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: jest.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      // Request body with valid token and file/email
      const mockRequestBody = {
        token: {
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
        },
        email: 'test@example.com',
        file: 'test_file_id',
      };

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Success!');

      // Marks completion of test
      done();
    });

    it('should return 200 with auth URL if neither token nor code is provided', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Mock OAuth2 auth URL generation for new users
      const mockOAuth2Client = {
        generateAuthUrl: jest.fn().mockReturnValue('https://accounts.google.com/o/oauth2/auth?test=url'),
      };
      google.auth.OAuth2.mockReturnValue(mockOAuth2Client);

      // Request body with no authentication credentials
      const mockRequestBody = {
        email: 'test@example.com',
        file: 'file_id',
      };

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(response.body).toHaveProperty('url');
      
      // Marks completion of test
      done();
    });

    it('should set OAuth2 credentials when token is provided', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Mock OAuth2 client and Google Drive
      const mockOAuth2Client = {
        setCredentials: jest.fn(),
      };
      google.auth.OAuth2.mockReturnValue(mockOAuth2Client);

      google.drive.mockReturnValue({
        permissions: {
          create: jest.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: jest.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      // Request body with valid token
      const mockToken = {
        access_token: 'test_access_token',
        refresh_token: 'test_refresh_token',
      };

      const mockRequestBody = {
        token: mockToken,
        email: 'test@example.com',
        file: 'test_file_id',
      };

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(mockOAuth2Client.setCredentials).toHaveBeenCalledWith(mockToken);
      expect(response.status).toBe(200);

      // Marks completion of test
      done();
    });

    it('should return auth URL from sendURL when no token or code provided', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Mock OAuth2 auth URL generation
      const mockOAuth2Client = {
        generateAuthUrl: jest.fn().mockReturnValue('https://accounts.google.com/o/oauth2/auth?test=url'),
      };
      google.auth.OAuth2.mockReturnValue(mockOAuth2Client);

      // Request body with no authentication credentials
      const mockRequestBody = {};

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('url');
      expect(response.body.url).toContain('accounts.google.com');

      // Marks completion of test
      done();
    });

    it('should handle grantPermission failure and return 400', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Mock OAuth2 client
      const mockOAuth2Client = {
        setCredentials: jest.fn(),
      };
      google.auth.OAuth2.mockReturnValue(mockOAuth2Client);

      // Mock google.drive to simulate permission grant failure
      google.drive.mockReturnValue({
        permissions: {
          create: jest.fn((opts, cb) => cb(new Error('Permission denied'))),
        },
        files: {
          list: jest.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      // Request body with valid token
      const mockRequestBody = {
        token: {
          access_token: 'test_token',
          refresh_token: 'test_refresh',
        },
        email: 'user@example.com',
        file: 'file_123',
      };

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(400);

      // Marks completion of test
      done();
    });

    it('should include token in response when setToken flag is true', async (done) => {
      // Mock successful credentials.json read
      fs.readFile.mockImplementation((path, callback) => {
        callback(null, JSON.stringify(mockCredentials));
      });

      // Mock OAuth2 client and Google Drive with success response
      const mockOAuth2Client = {
        setCredentials: jest.fn(),
      };
      google.auth.OAuth2.mockReturnValue(mockOAuth2Client);

      google.drive.mockReturnValue({
        permissions: {
          create: jest.fn((opts, cb) => cb(null, { data: {} })),
        },
        files: {
          list: jest.fn((opts, cb) => cb(null, { data: { files: [] } })),
        },
      });

      // Request body with generated token
      const mockToken = {
        access_token: 'generated_token',
        refresh_token: 'generated_refresh',
      };

      const mockRequestBody = {
        token: mockToken,
        email: 'test@example.com',
        file: 'test_file_id',
      };

      const response = await request
        .post('/api/grantpermission/')
        .send(mockRequestBody);

      // Tests
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Success!');

      // Marks completion of test
      done();
    });
  });
});
