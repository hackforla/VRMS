const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const async = require("async");
// const { Event } = require("../models/event.model");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

// GET /api/grantpermission/

router.post("/", async (req, res) => {
    fs.readFile("credentials.json", async (err, content) => {
        const credentialsObject = JSON.parse(content);
        const {
            client_secret,
            client_id,
            redirect_uris,
        } = credentialsObject.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[1]
        );

        // sends back error if credentials files cannot be read
        if (err)
            return res.status(500).send({
                message: "Error loading client secret file:" + err.message,
            });

        let token;
        let setToken = false;

        // if the user did not send a refresh/access token with them in the body request
        if (!req.body.token && req.body.code) {
            try {
                const tokenResult = await sendToken(
                    oAuth2Client,
                    req.body.code
                );
                if (!tokenResult.success) {
                    return res
                        .status(500)
                        .send({ message: tokenResult.message });
                } else {
                    console.log(tokenResult);
                    token = tokenResult.token;
                    setToken = true;
                }
            } catch (err) {
                return res.status(500).send({ message: err.message });
            }
            // if token is already placed into body request
        } else if (req.body.token) {
            token = req.body.token;
        }
        if (token) {
            oAuth2Client.setCredentials(token);
            try {
                // another callback function that returns promises can replace listFiles
                const result = await listFiles(oAuth2Client);
                if (result.success) {
                    {
                        const successObject = { message: "Success!" };
                        if (setToken) {
                            successObject.token = token;
                        }
                        return res.status(200).send(successObject);
                    }
                } else {
                    return res.status(500).send({ message: result.message });
                }
            } catch (err) {
                return res.status(500).send({ message: err.message });
            }
        } else {
            // returns a URL for the user to give permission
            return res.status(200).send({ url: sendURL(oAuth2Client) });
        }
    });
});

// If modifying these scopes, delete token.json.

/**
 * Creates an auth URL that lets the user give permission to VRMS.
 * @param {oAuth2Client} oAuth2Client The OAuth2 client needed to generate an auth url.
 */
function sendURL(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    return authUrl;
}

/**
 * Creates an token object including access token and refresh token that will allow the user to
 * be able to log in without needed to give permission each time
 * @param {oAuth2Client} oAuth2Client The authorization OAuth2 client needed to create a token object.
 * @param {String} code The code string from the auth URL.
 */
function sendToken(oAuth2Client, code) {
    return new Promise(function (resolve, reject) {
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                reject({
                    success: false,
                    message: "Error retrieving access token" + err.message,
                });
            resolve({ success: true, token });
        });
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Promise} Promise with an object that contains the boolean success to determine
 * what to do in the route. Rejection objects also have a message field.
 */
function listFiles(auth) {
    console.log("LISTFILES");
    const drive = google.drive({ version: "v3", auth });
    return new Promise(function (resolve, reject) {
        drive.files.list(
            {
                pageSize: 10,
                fields: "nextPageToken, files(id, name)",
            },
            (err, res) => {
                if (err)
                    reject({
                        success: false,
                        message: "The API returned an error: " + err.message,
                    });
                const files = res.data.files;
                if (files.length) {
                    console.log("Files:");
                    files.map((file) => {
                        console.log(`${file.name} (${file.id})`);
                    });
                    resolve({ success: true });
                } else {
                    return reject({
                        success: false,
                        message: "No files found",
                    });
                }
            }
        );
    });
}

function grantPermission(auth) {
    var fileId = "1xw2jvcxD8aIuFZ6C05-y-Um7gDY8fzK3iiy-X8yE1o0";
    var permissions = [
        {
            type: "user",
            role: "writer",
            emailAddress: "jonathan.ko523@gmail.com",
        },
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
