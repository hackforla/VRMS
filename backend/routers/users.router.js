const express = require('express');
const router = express.Router();

const { User } = require('../models/user.model');

const { UserController } = require('../controllers');

// // Get list of Users with GET
// router.get('/', UserController.user_list);

// Create User with POST
router.post('/', UserController.create);

// // Get User by id with GET
// router.get('/:UserID', UserController.user_by_id);


// // Update User with PATCH
// router.patch('/:UserID', UserController.update);

// GET /api/users/
router.get('/', (req, res) => {
  const { query } = req;
  const { headers } = req;
  const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    //   if (headers['x-customrequired-header'] !== 'test') {
    res.sendStatus(401);
  } else if (query.email) {
    User.findOne(query)
      .then((user) => {
        if (!user) {
          res.json(false);
        } else {
          res.json(user._id);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).json({
          message: `/GET Internal server error: ${err}`,
        });
      });
  } else {
    User.find()
      .then((users) => {
        if (!users) {
          res.json(false);
        } else {
          res.json(users);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500).json({
          message: `/GET Internal server error: ${err}`,
        });
      });
  }
});

router.get('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500).json({
                message: `/GET Internal server error: ${err}`
            })
        });
});

router.patch('/:id', (req, res) => {
    const { headers } = req;
    const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

    // Return 412 status if no userId
    if (req.params.id === "undefined") {
        return res.status(412).json({ error: "user id required" })
    }
    
    if (headers['x-customrequired-header'] !== expectedHeader) {
        res.sendStatus(401);
    } else {
        User
        .findByIdAndUpdate(req.params.id, req.body)
        .then(edit => res.json(req.params.id))
        .catch(err =>
            res.status(500).json({
                error: 'Couldn\'t edit form... Try again.'
            }));
    }
});

module.exports = router;
