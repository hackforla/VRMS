# Backend

## Login v2 (work in progress)

A separate sign-in system under `/api/auth/v2`, built on [Better Auth](https://www.better-auth.com)
rather than hand-written session and password code. It is **not** connected to the current login flow or to
anything in the client navigation; the trial page is at `/login-v2`. Today it supports email/username +
password. GitHub sign-in is planned and is a configuration of the same library.

**Turning it on:** set `AUTH_V2_SECRET` (32+ random characters, e.g. `openssl rand -base64 48`) and
`AUTH_V2_BASE_URL` (the public origin people use for the site, e.g. `http://localhost:3000` in development;
the client and API must share it). Without them the rest of the app is unaffected and every v2 route
answers `503 Login v2 is not configured on this server`. `AUTH_V2_SIGNIN_LIMIT` (optional, default 10) is
how many sign-in or sign-up requests one client IP may make per minute before getting `429`.

**Routes** are Better Auth's own, for example `POST /api/auth/v2/sign-up/email`,
`POST /api/auth/v2/sign-in/email`, `POST /api/auth/v2/sign-in/username`, `POST /api/auth/v2/sign-out` and
`GET /api/auth/v2/get-session`; see its documentation for the request shapes. They go through the same
custom-header check as the rest of the API.

**Where things live:** people are stored in the existing `users` collection (Better Auth writes to it with
the MongoDB driver, so a hook fills in `name.firstName`/`name.lastName` and `createdDate`, and new accounts
get `accessLevel: 'user'` and `isActive: true`). Password hashes, sessions and verification records are in
the `authV2Accounts`, `authV2Sessions` and `authV2Verifications` collections, which the rest of the app
never touches. A deactivated user (`isActive: false`) cannot sign in. Someone who already has a VRMS account
but no password cannot sign up with the same email, and cannot sign in with a password.

**Sessions:** a signed, `httpOnly`, `SameSite=Lax` cookie (`Secure` when the site is https) that is only
sent to `/api/auth/v2`; the session is stored in MongoDB, lasts 7 days and is extended as it is used.
Signing out deletes it. Requests that carry the cookie must come from the configured origin.

**Rate limiting** is the library's, kept in memory, so it is per backend process. It counts every request
to the sign-in and sign-up routes (successful ones too) per client IP: the IP is Express's `req.ip` (one
proxy hop is trusted, see `trust proxy` in `app.js` and `nginx/default.conf`), never a header the caller
chose.

## Running Tests

To maintain consistency across the front end and back end development, we are using Jest
as a test runner. 

### Execute Tests

You will need to be in the backend directory for this to work.

1. Run all tests: `npm test`
1. Run a single test: `npm test <testFileName>`

### Writing Tests

To maintain idempotent tests, we have opted to use in memory test databases. Jest, like
most test runners, has hooks or methods for you to call before or after tests. We can 
can setup our db and tear it down by importing the `setupDB` module.

    ```js
    // You will need to require the db-handler file.
    const { setupDB } = require("../setup-test");

    // You will need to name the in memory DB for this test. 
    setupDB("api-auth");
    ```

If you are unsure of where to start, then find a test that does something similar to your
aims. Copy, tweak, and run that test until you have your desired outcome. Also make sure
to give your test it's own name.

### Unit Tests

Unit tests are tests to write around a single unit. These can be tests around validation 
of a Model, or testing the boundaries on a class. 

### Integration Tests

Integration Tests are tests that verify that differing components work together. A common
example of an integration test is to verify that data is saved correctly in the database
based on the use of the API. 