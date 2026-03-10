module.exports = {
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'placeholder_secret_key_for_development_only',
  CUSTOM_REQUEST_HEADER: process.env.CUSTOM_REQUEST_HEADER,
  // 15 minutes
  ACCESS_TOKEN_EXPIRATION: '15m',
  ACCESS_TOKEN_EXPIRATION_MS: 15 * 60 * 1000,
  // 30 days
  REFRESH_TOKEN_EXPIRATION_MS: 30 * 24 * 60 * 60 * 1000,
};
