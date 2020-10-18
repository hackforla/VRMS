const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const SECRET_ID = process.env.GMAIL_SECRET_ID;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const EMAIL_ACCOUNT = process.env.GMAIL_EMAIL;


/** Create an access token to use Google Gmail account as our SMTP provider. */
const getAccessTokenForGmailAccount = () => {
  const oauth2Client = new OAuth2(
    CLIENT_ID, // ClientID
    SECRET_ID, // Client Secret
    'https://developers.google.com/oauthplayground', // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });
  const accessToken = oauth2Client.getAccessToken();
  return accessToken;
};

/** Sends emails to Mailhog docker container when developing.
 * 
 * The Mailhog container must be available for this to succeed.
*/
const createMailhogSMTPSTransport = () => {
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

/** Sends emails through Gmail account. 
 * 
 * This allows us to use a Gmail account as our outgoing email. You can log 
 * into this email account to see that the sent messages includes your email.
 * 
 * This requires setting up the Gmail account for use. https://tinyurl.com/y4farjwt
*/
const createGmailSMTPTransport = () =>  {
  const accessToken = getAccessTokenForGmailAccount();
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

/** Send user signin link to their email.
 *  
 * - Email sent from smtpTransport. 
 * - Uses React frontend redirect mechanism.
 * */
async function sendSigninEmailByTransport(smtpTransport, email, token) {
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

  try {
    const info = await smtpTransport.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.log('err:', err);
  }
};

/** Returns the appropriate email transport. */
const getEmailTransport = () => {
  let smtpTransport;
  if (process.env.NODE_ENV === 'development') {
    smtpTransport = createMailhogSMTPSTransport();
  }
  smtpTransport = createGmailSMTPTransport();
  return smtpTransport;
};

const sendUserEmailSigninLink = (email, token) => {
  const smtpTransport = getEmailTransport();
  // As we are using async/await with nodemailer, then we have to catch the promise.
  // See the nodemailer docs for using async/await https://nodemailer.com/about/
  sendSigninEmailByTransport(smtpTransport, email, token).catch(console.error);
};

const emailController = {
  sendUserEmailSigninLink,
};
module.exports = emailController;

