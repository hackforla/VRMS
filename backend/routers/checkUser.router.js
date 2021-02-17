const express = require('express');
const router = express.Router();

const { User } = require('../models/user.model');

// TODO: Refactor checkuser and test. Consider moving to auth.

// GET /api/checkuser/
router.post('/', (req, res) => {
  const { email, auth_origin } = req.body;
  console.log(email);
  console.log(`auth_origin: ${auth_origin}`);

  if (email === 'undefined') {
    return res.sendStatus(400);
  }

  if (email) {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.sendStatus(400);
        } else {
          return res.status(200).send(user);
        }
      })
      .catch((err) => {
        console.log(err);

        return res.sendStatus(400);
      });
  } else {
    // TODO: Refactor as path is not called, or tested.
    res.json({ message: 'Enter the email address you used to check-in last time.' });
  }
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

module.exports = router;
