module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'placeholder_secret_key_for_development_only',
  CUSTOM_REQUEST_HEADER: process.env.CUSTOM_REQUEST_HEADER,
  // 15 minutes as a string for JWT expiration
  ACCESS_TOKEN_EXPIRATION: '15m',
  // 30 days in milliseconds for refresh token expiration
  REFRESH_TOKEN_EXPIRATION_MS: 30 * 24 * 60 * 60 * 1000,
};
