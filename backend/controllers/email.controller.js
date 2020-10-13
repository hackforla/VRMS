const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const SECRET_ID = process.env.GMAIL_SECRET_ID;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const EMAIL_ACCOUNT = process.env.GMAIL_EMAIL;

async function mailServer(email, token) {
  const oauth2Client = new OAuth2(
    CLIENT_ID, // ClientID
    SECRET_ID, // Client Secret
    'https://developers.google.com/oauthplayground', // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });
  const accessToken = oauth2Client.getAccessToken();

  let smtpTransport;
  if (process.env.NODE_ENV === 'test') {
    // Send mail to Mailhog Docker container
    smtpTransport = nodemailer.createTransport({
      host: '127.0.0.1',
      port: 1025,
      auth: {
        user: 'user',
        pass: 'password',
      },
    });
  } else {
    smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_ACCOUNT,
        clientId: CLIENT_ID,
        clientSecret: SECRET_ID,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });
  }
  const encodedToken = encodeURIComponent(token);
  const emailLink = `https://tinyurl.com/nyqxd/handleauth?token=${encodedToken}&signIn=true`;
  const encodedUri = encodeURI(emailLink);
  const mailOptions = {
    from: EMAIL_ACCOUNT,
    to: email,
    subject: 'VRMS Magic link 🎩 !',
    html: `<a href=${encodedUri}>
        LOGIN HERE
      </a>`,
    text: `Magic link: ${emailLink}`,
  };

  const localhostEmail = async () => {
    await smtpTransport.sendMail(mailOptions, (error, response) => {
      console.log('email sent');
      smtpTransport.close();
    });
  };

  const prodEmail = async () => {
    await smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      smtpTransport.close();
    });
  };

  if (process.env.NODE_ENV === 'test') {
    localhostEmail();
  } else {
    prodEmail();
  }
}

exports.sendUserEmailSigninLink = async (email, token) => {
  await mailServer(email, token);
};
