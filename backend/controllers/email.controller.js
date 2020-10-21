const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { resolveConfig } = require('prettier');

const { OAuth2 } = google.auth;

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const SECRET_ID = process.env.GMAIL_SECRET_ID;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const EMAIL_ACCOUNT = process.env.GMAIL_EMAIL;


const emailCientToken = async () => {
  const oauth2Client = new OAuth2(
    CLIENT_ID, // ClientID
    SECRET_ID, // Client Secret
    'https://developers.google.com/oauthplayground', // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });
  accessToken = oauth2Client.getAccessToken();
  return accessToken;
};

const createDockerSMTPSTransport = async () => {
  // Send mail to Mailhog Docker container
  const smtpTransport = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    auth: {
      user: 'user',
      pass: 'password',
    },
  });
  return smtpTransport;
};

const createProdSMTPTransport = async () => {
  const accessToken = await emailCientToken();
  const smtpTransport = nodemailer.createTransport({
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
  return smtpTransport;
};

async function sendMail(smtpTransport, email, token, origin) {
  const encodedToken = encodeURIComponent(token);
  const emailLink = `${origin}/handleauth?token=${encodedToken}&signIn=true`;
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

  let info = await smtpTransport.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

async function mailServer(email, token, origin) {
  let smtpTransport;
  if (process.env.NODE_ENV === 'development') {
    smtpTransport = await createDockerSMTPSTransport();
  } else {
    smtpTransport = await createProdSMTPTransport();
  }

  sendMail(smtpTransport, email, token, origin).catch(console.error);
}

const sendUserEmailSigninLink = async (email, token, origin) => {
  await mailServer(email, token, origin);
};

const emailController = {
  sendUserEmailSigninLink,
};
module.exports = emailController;

