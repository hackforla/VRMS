import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { APIError } from 'better-auth/api';
import { username } from 'better-auth/plugins';
import mongoose from 'mongoose';
import {
  AUTH_V2_BASE_PATH,
  CLIENT_IP_HEADER,
  getAuthSecret,
  getBaseUrl,
  getSigninLimit,
} from '../config/authV2.config.ts';

const MINUTE = 60;

// Login v2 keeps its people in its own collections, apart from the `users`
// collection the rest of the app reads, until account linking is decided.
function createAuth(db: NonNullable<typeof mongoose.connection.db>) {
  const signinRule = { window: MINUTE, max: getSigninLimit() };

  return betterAuth({
    secret: getAuthSecret() ?? undefined,
    baseURL: getBaseUrl() ?? undefined,
    basePath: AUTH_V2_BASE_PATH,
    database: mongodbAdapter(db),
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
    plugins: [username({ minUsernameLength: 3, maxUsernameLength: 30 })],
    user: {
      modelName: 'authV2Users',
      additionalFields: {
        accessLevel: { type: 'string', required: false, defaultValue: 'user', input: false },
        isActive: { type: 'boolean', required: false, defaultValue: true, input: false },
      },
    },
    session: { modelName: 'authV2Sessions' },
    account: { modelName: 'authV2Accounts' },
    verification: { modelName: 'authV2Verifications' },
    advanced: {
      cookiePrefix: 'vrms-v2',
      // Only the v2 routes ever see the session cookie.
      defaultCookieAttributes: { path: AUTH_V2_BASE_PATH },
      ipAddress: { ipAddressHeaders: [CLIENT_IP_HEADER] },
      // On by default outside tests; stated so the same checks run in the test suite.
      disableOriginCheck: false,
    },
    rateLimit: {
      enabled: true,
      storage: 'memory',
      window: MINUTE,
      max: 100,
      customRules: {
        '/sign-in/email': signinRule,
        '/sign-in/username': signinRule,
        '/sign-up/email': signinRule,
      },
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session, ctx) => {
            const person = await ctx?.context.adapter.findOne<{ isActive?: boolean }>({
              model: 'user',
              where: [{ field: 'id', value: session.userId }],
            });
            if (person && person.isActive === false) {
              throw new APIError('FORBIDDEN', { message: 'This account is not active' });
            }
          },
        },
      },
    },
  });
}

type Auth = ReturnType<typeof createAuth>;
let auth: Auth | undefined;

// Built on first use because it needs the live MongoDB connection and the
// (optional) v2 settings, neither of which exist when the app starts.
export function getAuth(): Auth | null {
  const db = mongoose.connection.db;
  if (!db) return null;
  auth ??= createAuth(db);
  return auth;
}

// Tests change the v2 settings between cases; the next getAuth() builds from the new ones.
export function resetAuthV2() {
  auth = undefined;
}
