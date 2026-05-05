const { RefreshToken } = require('../models');

async function cleanupExpiredTokens() {
  try {
    const result = await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    console.log(`Cleaned up ${result.deletedCount} expired refresh tokens`);
  } catch (err) {
    console.error('Token cleanup error:', err);
  }
}

// Run daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);

module.exports = { cleanupExpiredTokens };
