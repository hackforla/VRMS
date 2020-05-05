const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const async = require("async");
// const { Event } = require("../models/event.model");

// GET /api/events/

router.post("/:id", (req, res) => {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    // authorize(JSON.parse(content), grantPermission);

    // authorize(JSON.parse(content), listFiles);
    authorize(JSON.parse(content), grantPermission);
  });
});

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[1]
  );
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log("READING FILE");
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  console.log("GETACCESSTOKEN");
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  //After clicking this link and authorizing, all the stuff in the url of the landing page
  //after 'code' is the code to enter.
  //For instance: http://localhost:3000/?code=4%2FzQEAykm8BPVHrhyI3zqQJkBJuPxKWddaPcFDs-LNFE_IqVNV2-srTnTs81Yqh5qbin2Kz0WQYVjzxG3gjWo59o&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive#
  //so code will be '4%2FzQEAykm8BPVHrhyI3zqQJkBJuPxKWddaPcFDs-LNFE_IqVNV2-srTnTs81Yqh5qbin2Kz0WQYVjzxG3gjWo59o&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive#'
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  console.log("LISTFILES");
  const drive = google.drive({ version: "v3", auth });
  drive.files.list(
    {
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        console.log("Files:");
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("No files found.");
      }
    }
  );
}

function grantPermission(auth) {
  console.log("GRANT PERMISSION");
  var fileId = "1xw2jvcxD8aIuFZ6C05-y-Um7gDY8fzK3iiy-X8yE1o0";
  var permissions = [
    {
      type: "user",
      role: "writer",
      emailAddress: "jonathan.ko523@gmail.com",
    },
    // {
    //   type: "domain",
    //   role: "writer",
    //   domain: "example.com",
    // },
  ];
  // Using the NPM module 'async'
  async.eachSeries(
    permissions,
    function (permission, permissionCallback) {
      const drive = google.drive({ version: "v3", auth });
      drive.permissions.create(
        {
          resource: permission,
          fileId: fileId,
          fields: "id",
        },
        function (err, res) {
          if (err) {
            // Handle error...
            console.error(err);
            permissionCallback(err);
          } else {
            console.log("Response: ", res);

            console.log("Permission ID: ", res.id);
            permissionCallback();
          }
        }
      );
    },
    function (err) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        // All permissions inserted
      }
    }
  );
}

module.exports = router;
