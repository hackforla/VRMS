/*eslint-disable */
module.exports = {
  SECRET: process.env.JWT_SECRET,
  CUSTOM_REQUEST_HEADER: process.env.CUSTOM_REQUEST_HEADER,
  TOKEN_EXPIRATION_SEC: 60 * 60 * 24 * 7, // 7 days
};
/* eslint-enable */
