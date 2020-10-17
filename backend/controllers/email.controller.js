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

async function sendMail(smtpTransport, email, token) {
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

  let info = await smtpTransport.sendMail(mailOptions);
  // console.log('Message sent: %s', info.messageId);

  // await smtpTransport.close();
};

async function mailServer(email, token) {
  let smtpTransport;
  if (process.env.NODE_ENV === 'production') {
    smtpTransport = await createProdSMTPTransport();
  } else {
    smtpTransport = await createDockerSMTPSTransport();
  }

  sendMail(smtpTransport, email, token).catch(console.error);
}

const sendUserEmailSigninLink = async (email, token) => {
  await mailServer(email, token);
};

const emailController = {
  sendUserEmailSigninLink,
};
module.exports = emailController;

