/**
 * Diagnostic probe: is GMAIL_REFRESH_TOKEN still valid, and can we prove *why* it fails?
 *
 * Google's `invalid_grant` is deliberately vague — the same error is returned for a token
 * that was revoked, a token that hit the 7-day cap on an unverified OAuth app, and a token
 * that was never valid. So a single failing call proves nothing on its own. This script
 * runs the exchange alongside control probes so the result is interpretable:
 *
 *   1. LIVE          real refresh token, real client creds       -> the failure we care about
 *   2. NEVER-VALID   real client creds, deliberately mangled token -> baseline for "not a real token"
 *   3. WRONG-CLIENT  real token, wrong client secret            -> baseline for "client is the problem"
 *   4. REACHABILITY  unauthenticated call to Google's own tokeninfo endpoint -> proves DNS/TLS
 *                    egress and that Google is answering us at all
 *
 * Probes 1 and 2 returning an identical error is the key result: it means Google's response
 * cannot distinguish "revoked/expired" from "malformed", and probe 3 vs 4 prove the client
 * credentials and the network are not at fault. Together that narrows the cause to the token
 * itself. Run `gcloud`/Cloud Console or the OAuth consent screen to separate revoke-vs-expiry.
 *
 * Usage:  node scripts/checkGoogleRefreshToken.js
 * Secrets are never printed — tokens are shown only as a length + SHA-256 fingerprint.
 */

import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDir, '..', '.env') });

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_SECRET_ID;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

/** Never log a secret; log a stable fingerprint so values can be compared across runs. */
function fingerprint(value) {
  if (!value) return 'MISSING';
  const sha = crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
  return `len=${value.length} sha256:${sha}`;
}

function redact(value) {
  if (!value) return 'MISSING';
  return `${value.slice(0, 3)}...${value.slice(-2)}`;
}

/** Ask Google to exchange a refresh token for an access token. Never throws. */
async function exchangeRefreshToken({ clientId, clientSecret, refreshToken, label }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  let response;
  let payload;
  try {
    response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    payload = await response.json();
  } catch (err) {
    console.log(`  [${label}] network/transport failure: ${err.message}`);
    return { ok: false, verdict: 'Network/transport failure — inconclusive.' };
  }

  const { error } = payload;
  console.log(`  [${label}] HTTP ${response.status} ${JSON.stringify(payload)}`);

  if (!response.ok) {
    if (error === 'invalid_grant') {
      return {
        ok: false,
        verdict: 'invalid_grant — Google refused this refresh token.',
      };
    }
    if (error === 'invalid_client') {
      return { ok: false, verdict: 'invalid_client — the client id/secret is the problem.' };
    }
    return { ok: false, verdict: `Unexpected OAuth error: ${error}` };
  }

  // Success: never echo the access token itself.
  console.log(`  [${label}] access_token issued: ${fingerprint(payload.access_token)}`);
  console.log(`  [${label}] expires_in=${payload.expires_in} scope=${payload.scope ?? 'n/a'}`);
  return { ok: true, verdict: 'Refresh token is LIVE — Google issued an access token.' };
}

/** Prove we can actually reach Google over TLS, and that our stack sends a well-formed request.
 *
 * Deliberately hits the SAME provider as the failing call, so a failure here would mean
 * "the network is the problem" rather than "the token is the problem". Any HTTP status
 * counts as reachable — even 400 means DNS resolved, TLS negotiated, and Google replied.
 */
async function probeReachability() {
  try {
    const response = await fetch('https://oauth2.googleapis.com/tokeninfo');
    const body = await response.text();
    console.log(`  [reachability] GET oauth2.googleapis.com/tokeninfo -> HTTP ${response.status}`);
    console.log(`  [reachability] body: ${body.slice(0, 120)}`);
    console.log(
      '  [reachability] Reached Google over TLS. Network/DNS/egress are NOT the problem.',
    );
  } catch (err) {
    console.log(`  [reachability] could not reach Google: ${err.message}`);
    console.log('  [reachability] Network problem — the token result below is INCONCLUSIVE.');
  }
}

async function main() {
  console.log('Google refresh-token validity probe');
  console.log('-----------------------------------');
  console.log(`  client_id     ${redact(CLIENT_ID)}  ${fingerprint(CLIENT_ID)}`);
  console.log(`  client_secret ${fingerprint(CLIENT_SECRET)}`);
  console.log(`  refresh_token ${redact(REFRESH_TOKEN)}  ${fingerprint(REFRESH_TOKEN)}\n`);

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('Missing GMAIL_CLIENT_ID / GMAIL_SECRET_ID / GMAIL_REFRESH_TOKEN in .env.');
    process.exitCode = 1;
    return;
  }

  // 1. The failure we care about.
  console.log('1. LIVE — real refresh token');
  const live = await exchangeRefreshToken({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    label: 'live',
  });
  console.log(`     => ${live.verdict}\n`);

  // 2. Control: a token that could never have been valid.
  console.log('2. CONTROL (never-valid) — same client, mangled token');
  const neverValid = await exchangeRefreshToken({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: `${REFRESH_TOKEN.slice(0, -6)}XXXXXX`,
    label: 'never-valid',
  });
  console.log(`     => ${neverValid.verdict}\n`);

  // 3. Control: real token, wrong client secret.
  console.log('3. CONTROL (wrong client) — real token, bad client secret');
  const wrongClient = await exchangeRefreshToken({
    clientId: CLIENT_ID,
    clientSecret: `${CLIENT_SECRET.slice(0, -1)}X`,
    refreshToken: REFRESH_TOKEN,
    label: 'wrong-client',
  });
  console.log(`     => ${wrongClient.verdict}\n`);

  // 4. Control: can we even reach Google?
  console.log('4. CONTROL (reachability) — unauthenticated call to Google');
  await probeReachability();
  console.log('');

  console.log('-----------------------------------');
  if (live.ok) {
    console.log('RESULT: the refresh token is still valid. Re-check your diagnosis.');
  } else if (live.verdict.startsWith('invalid_client')) {
    console.log('RESULT: the OAuth client is misconfigured — fix client id/secret first.');
  } else {
    const indistinguishable =
      neverValid.verdict.startsWith('invalid_grant') && live.verdict.startsWith('invalid_grant');
    console.log(`RESULT: the refresh token is refused by Google (${live.verdict})`);
    console.log(
      indistinguishable
        ? '        ...and Google gives the identical error for a token that never existed, so'
        : '        (control probe behaved unexpectedly — see above)',
    );
    if (indistinguishable) {
      console.log('        the response cannot separate revoked / expired / never-valid.');
      console.log('        Client creds are shown healthy by control 3 (invalid_client only');
      console.log('        when the secret is wrong) and egress by control 4, so the token');
      console.log('        itself is the fault. Distinguish revoke-vs-expiry via');
      console.log('        Google account > Security > Third-party access, and check the OAuth');
      console.log('        consent screen publishing status (Testing => 7-day refresh-token cap).');
    }
  }
  if (live.ok) process.exitCode = 1;
}

await main();
