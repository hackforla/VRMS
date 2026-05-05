import express from 'express';
const router = express.Router();
import fs from 'fs';

import { google } from 'googleapis';
import async from 'async';
import fetch from 'node-fetch';
import { authUser } from '../middleware/auth.middleware.js';
import AuthUtils from '../../shared/authorizationUtils.js';
import { ROLES } from '../../shared/roles.js';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// placeholder org for testing
const githubOrganization = 'testvrms';

// GET /api/grantpermission/googleDrive
router.post('/googleDrive', async (req, res) => {
  let credentials = JSON.parse(process.env.GOOGLECREDENTIALS);

  //checks if email and file to change are in req.body
  if (!req.body.email || !req.body.file) {
    return res.sendStatus(400);
  }

  const { client_secret, client_id, redirect_uris } = credentials;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);
  console.log('AFTERCLIENT');

  const tokenObject = {
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    scope: 'https://www.googleapis.com/auth/drive',
    token_type: 'Bearer',
    expiry_date: process.env.GOOGLE_EXPIRY_DATE,
  };
  oAuth2Client.setCredentials(tokenObject);

  console.log('AFTR OAUTH');
  try {
    const result = await grantPermission(oAuth2Client, req.body.email, req.body.file);
    if (result.success) {
      const successObject = { message: 'Success!' };
      return res.status(200).send(successObject);
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
});

// Route accounts for onboaring admins or regular users
router.post('/gitHub', authUser, async (req, res) => {
  const { teamName, handle } = req.body;
  const userHandle = handle;
  const baseTeamSlug = createSlug(teamName);
  const managerTeamSlug = baseTeamSlug + '-managers';
  const adminTeamSlug = baseTeamSlug + '-admins';

  const teamSlugs = [baseTeamSlug, managerTeamSlug];

  if (AuthUtils.hasMinimumRole(req.user, ROLES.ADMIN)) {
    teamSlugs.push(adminTeamSlug);
  }
  function createSlug(string) {
    let slug = string.toLowerCase();
    return slug.split(' ').join('-');
  }

  try {
    const userStatus = await checkOrgMembershipStatus(userHandle);
    const orgMembershipStatus = userStatus
      ? userStatus
      : (await inviteToOrg(userHandle)) && 'pending';

    console.log({ teamSlugs });
    await Promise.all(
      teamSlugs.map(async (slug) => {
        const result = await addToTeam(userHandle, slug);
        console.log({ slug });
        if (result === 'team not found') {
          throw new Error('team not found');
        }
        if (!result) {
          throw new Error('user not added to one or more teams');
        }
        return;
      }),
    );

    const result = {
      orgMembershipStatus,
      teamMembershipStatus: 'pending',
    };

    if (orgMembershipStatus === 'active') {
      result.teamMembershipStatus = 'active';
      result.publicMembership = await checkPublicMembership(userHandle);
      result.twoFAenabled = await check2FA(userHandle);
    }

    return res.status(200).send(result);
  } catch (err) {
    console.error(err.message);
    return res.status(400).send({ message: 'Error occurred while processing request' });
  }
});

router.post('/', async (req, res) => {
  fs.readFile('credentials.json', async (err, content) => {
    const credentialsObject = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentialsObject.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);

    if (err) {
      return res.sendStatus(400);
    }

    let token;
    let setToken = false;

    if (!req.body.token && req.body.code) {
      try {
        const tokenResult = await sendToken(oAuth2Client, req.body.code);
        if (!tokenResult.success) {
          return res.sendStatus(400);
        } else {
          console.log(tokenResult);
          token = tokenResult.token;
          setToken = true;
        }
      } catch (err) {
        console.error(err.message);
        return res.sendStatus(400);
      }
    } else if (req.body.token) {
      token = req.body.token;
    }
    if (token) {
      oAuth2Client.setCredentials(token);
      try {
        console.log('TRY');
        const result = await grantPermission(oAuth2Client, req.body.email, req.body.file);
        if (result.success) {
          {
            const successObject = { message: 'Success!' };
            if (setToken) {
              successObject.token = token;
            }
            return res.status(200).send(successObject);
          }
        } else {
          return res.sendStatus(400);
        }
      } catch (err) {
        console.log(err.message);
        return res.sendStatus(400);
      }
    } else {
      return res.status(200).send({ url: sendURL(oAuth2Client) });
    }
  });
});

function sendURL(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
}

function sendToken(oAuth2Client, code) {
  return new Promise(function (resolve, reject) {
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        reject({
          success: false,
          message: 'Error retrieving access token' + err.message,
        });
      resolve({ success: true, token });
    });
  });
}

/**
 * Gives Google Drive permission to an email address for the file ID
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {String} email E-mail to receive Google Drive invite
 * @param {String} fileId File ID to give permissions
 * @returns {Promise} Promise with an object that contains the boolean success to determine
 * what to do in the route. Rejection objects also have a message field.
 */
function grantPermission(auth, email, fileId) {
  console.log('GRANT PERMISSIONS');
  var permissions = [
    {
      type: 'user',
      role: 'writer',
      emailAddress: email,
    },
  ];

  return new Promise(function (resolve, reject) {
    async.eachSeries(permissions, function (permission, permissionCallback) {
      const drive = google.drive({ version: 'v3', auth });
      drive.permissions.create(
        {
          resource: permission,
          fileId: fileId,
          fields: 'id',
          emailMessage: 'Hi there! You are receiving this message from the VRMS team. Enjoy!',
        },
        (err, res) => {
          if (err) {
            console.log('PROMISE ERROR', err);
            reject({
              success: false,
              message: 'The API returned an error: ' + err.message,
            });
          } else {
            console.log('RES', res);
            permissionCallback();
            resolve({ success: true });
          }
        },
      );
    });
  });
}

function checkOrgMembershipStatus(githubHandle) {
  return fetch('https://api.github.com/orgs/' + githubOrganization + '/memberships/' + githubHandle, {
    method: 'GET',
    headers: {
      Authorization: 'token ' + process.env.GITHUB_TOKEN,
    },
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      if (res.status === 404) return false;
      return new Error('Unexpected result');
    })
    .then((res) => {
      if (res) {
        return res.state === 'pending' ? 'pending' : 'active';
      } else {
        return false;
      }
    });
}

function inviteToOrg(githubHandle) {
  return fetch(
    'https://api.github.com/orgs/' + githubOrganization + '/memberships/' + githubHandle + '?role=member',
    {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + process.env.GITHUB_TOKEN,
      },
    },
  ).then((res) => (res.status === 200 ? true : new Error('Unexpected response')));
}

function addToTeam(githubHandle, teamSlug) {
  return fetch(
    'https://api.github.com/orgs/' + githubOrganization + '/teams/' + teamSlug + '/memberships/' + githubHandle,
    {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + process.env.GITHUB_TOKEN,
      },
    },
  )
    .then((res) => ({
      result: res.json(),
      status: res.status,
    }))
    .then((res) => {
      if (res.result.message === 'Not Found') {
        return 'team not found';
      } else {
        console.log(res.status);
        return Boolean(res.status === 200);
      }
    });
}

function check2FA(githubHandle) {
  return fetch(
    'https://api.github.com/orgs/' + githubOrganization + '/members?filter=2fa_disabled',
  ).then((no2FAMembersArr) => {
    if (no2FAMembersArr.length) {
      return !no2FAMembersArr.includes((member) => member.login === githubHandle);
    }
    return true;
  });
}

function checkPublicMembership(githubHandle) {
  return fetch(
    'https://api.github.com/orgs/' + githubOrganization + '/public_members/' + githubHandle,
  ).then((res) => (res.status === 204 ? true : false));
}

export default router;
