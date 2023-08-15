/*eslint-disable */
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  SECRET: JWT_SECRET,
  CUSTOM_REQUEST_HEADER: process.env.CUSTOM_REQUEST_HEADER,
  TOKEN_EXPIRATION_SEC: 900,
};
/* eslint-enable */