import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { hasAnyRole, hasMinimumRole } from '../../shared/authorizationUtils.js';
import { CONFIG_AUTH } from '../config/index.js';
import { RefreshToken, User } from '../models/index.js';

const SECRET = CONFIG_AUTH.JWT_SECRET;

// Utility functions

function generateAccessToken(user, auth_origin) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.accessLevel,
      accessLevel: user.accessLevel,
      auth_origin: auth_origin,
    },
    SECRET,
    { expiresIn: CONFIG_AUTH.ACCESS_TOKEN_EXPIRATION },
  );
}

function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return (
    req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip
  );
}

async function authenticateAccessToken(req, res, next) {
  try {
    let accessToken =
      req.cookies.token || req.headers['x-access-token'] || req.headers['authorization'];

    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (accessToken.startsWith('Bearer ')) {
      accessToken = accessToken.slice(7, accessToken.length);
    }

    const decoded = jwt.verify(accessToken, SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(401).json({ error: 'Authentication failed' });
  }
}

const authUser = authenticateAccessToken;

async function authenticateRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const tokenHash = hashToken(refreshToken);

    const tokenDoc = await RefreshToken.findOne({
      hash: tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found for this token' });
    }

    req.user = user;
    req.refreshToken = tokenDoc;

    next();
  } catch (error) {
    console.error('Refresh token validation error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasAnyRole(req.user, ...roles)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required_role: roles,
        your_role: req.user.accessLevel,
      });
    }

    next();
  };
}

function requireMinimumRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = req.user;
    if (!hasMinimumRole(user, role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required_minimum_role: role,
        your_role: req.user.accessLevel,
      });
    }
    next();
  };
}

function verifyCookie(req, res, next) {
  jwt.verify(req.cookies.token, SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.userId = decoded.id;
    req.role = decoded.accessLevel;

    next();
  });
}

const Auth = {
  authenticateAccessToken,
  authUser,
  authenticateRefreshToken,
  requireRole,
  requireMinimumRole,
  generateAccessToken,
  generateRefreshToken,
  getClientIp,
  hashToken,
  verifyCookie,
};

export default Auth;

export {
  authenticateAccessToken,
  authUser,
  authenticateRefreshToken,
  requireRole,
  requireMinimumRole,
  generateAccessToken,
  generateRefreshToken,
  getClientIp,
  hashToken,
  verifyCookie,
};
