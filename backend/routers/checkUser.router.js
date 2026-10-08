import express from 'express';
const router = express.Router();

import { User } from '../models/user.model.js';

// TODO: Refactor checkuser and test. Consider moving to auth.

/**
 * Error responses from this router use the shape:
 *
 *   { code: <stable identifier>, message: <human-readable fallback> }
 *
 * `code` is the contract clients map to user-facing copy; see
 * AUTH_ERROR_MESSAGES in client/src/components/auth/Auth.jsx. `message` exists
 * only so a client that does not recognize a code still has something to
 * display -- never match on its wording.
 *
 *   400 INVALID_EMAIL  - email missing or malformed in the request body
 *   404 USER_NOT_FOUND - no account exists for that email
 *   500 SERVER_ERROR   - database or internal failure; a retry may succeed
 *
 * A server that is unreachable produces no status code at all, so the client
 * classifies that case itself (NETWORK_ERROR in user.service.js).
 */

// POST /api/checkuser/
router.post('/', (req, res) => {
  const { email, auth_origin } = req.body;

  if (!email || email === 'undefined') {
    return res.status(400).json({
      code: 'INVALID_EMAIL',
      message: 'Enter the email address you used to check-in last time.',
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          code: 'USER_NOT_FOUND',
          message: "We don't recognize your email address.",
        });
      }

      return res.status(200).send({ user: user, auth_origin: auth_origin });
    })
    .catch((err) => {
      console.log(err);

      return res.status(500).json({
        code: 'SERVER_ERROR',
        message: 'We’re experiencing technical difficulties. Please try again later.',
      });
    });
});

router.get('/:id', (req, res) => {
  // TODO: Refactor and test
  User.findById(req.params.id)
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

export default router;
