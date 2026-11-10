import mongoose from 'mongoose';
import { REFRESH_TOKEN_TTL_MS } from '../config/authV2.config.ts';

// One document per refresh token ever issued by Login v2. Only the SHA-256 of
// the token is stored. Tokens are never edited except to mark them used; a
// whole `family` (one sign-in) is revoked by deleting its documents.
const refreshTokenV2Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  family: { type: String, required: true, index: true },
  hash: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: () => new Date() },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  },
  // Set when the token is exchanged for a new one.
  usedAt: { type: Date, default: null },
});

// MongoDB deletes each document once its own expiresAt has passed.
refreshTokenV2Schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenV2 = mongoose.model('RefreshTokenV2', refreshTokenV2Schema);
