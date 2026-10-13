import mongoose from 'mongoose';
import { CONFIG_AUTH } from '../config/index.js';

mongoose.Promise = global.Promise;

const refreshTokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    immutable: true,
    index: true,
  },
  hash: { type: String, required: true, unique: true, immutable: true },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
    immutable: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + CONFIG_AUTH.REFRESH_TOKEN_EXPIRATION_MS,
  },
  deviceInfo: {
    ipAddress: String,
    deviceType: String,
  },
});

refreshTokenSchema.methods.serialize = function () {
  return {
    id: this._id,
    createdAt: this.createdAt,
    expiresAt: this.expiresAt,
    deviceInfo: {
      ipAddress: this.ipAddress,
      deviceType: this.deviceType,
    },
  };
};

refreshTokenSchema.index({ expires_at: 1 }, { expiresAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export { RefreshToken };
