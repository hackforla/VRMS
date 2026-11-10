# Backend

## Login v2 (work in progress)

A separate sign-in system under `/api/auth/v2`, built and tested on its own. It is **not** connected to
the current login flow or to anything in the client navigation; the trial page is at `/login-v2`.
Today it supports first-party email/username + password. GitHub sign-in is planned and will plug into
the same session code.

**Turning it on:** set `AUTH_V2_ACCESS_TOKEN_SECRET` (32+ random characters, e.g. `openssl rand -base64 48`).
Without it the rest of the app is unaffected and every v2 route answers `503 Login v2 is not configured`.
`AUTH_V2_BCRYPT_ROUNDS` (optional, default 12) sets the password hashing cost.
`AUTH_V2_SIGNIN_LIMIT` (optional, default 10) caps failed sign-in and sign-up attempts (any non-2xx answer) per client IP in each
15-minute window; further attempts get `429` with a JSON `error`. Counts are kept in memory per backend
process (no account lockout).

| Route | What it does |
| --- | --- |
| `POST /api/auth/v2/signup` | `{ email, password, username?, firstName?, lastName? }` creates an account and signs in |
| `POST /api/auth/v2/signin` | `{ identifier, password }` where `identifier` is an email or a username |
| `POST /api/auth/v2/refresh` | trades the refresh cookie for a new access token and a new refresh cookie |
| `POST /api/auth/v2/logout` | revokes the sign-in's refresh tokens and clears the cookie |
| `GET /api/auth/v2/me` | returns the signed-in user; needs `Authorization: Bearer <access token>` |

**Sessions:** sign-in returns a 15-minute access token in the response body (the client keeps it in
memory only) and sets a 30-day refresh token in an `httpOnly`, `SameSite=Strict` cookie (`Secure` in
production) that is only sent to `/api/auth/v2`. Every refresh issues a new refresh token and marks the
old one used. Replaying a used token ends that whole sign-in, except within 10 seconds of the rotation,
which is treated as a second browser tab racing: that request gets `409`, the cookie is left alone, and
the client retries with the newer cookie the other tab received. Only SHA-256 hashes of refresh tokens are stored, in the
`RefreshTokenV2` collection, which MongoDB expires automatically via a TTL index on `expiresAt`.

**Passwords:** hashed with bcrypt (via `bcryptjs`) and stored in `User.passwordHash`, which is never
selected or returned unless explicitly asked for. Passwords are 10 to 72 bytes (bcrypt's limit).

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