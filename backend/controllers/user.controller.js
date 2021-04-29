const jwt = require('jsonwebtoken');

const EmailController = require('./email.controller');
const { CONFIG_AUTH } = require('../config');

const { User } = require('../models');

const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

const UserController = {};

// Get list of Users with GET
UserController.user_list = async function (req, res) {
  const { headers } = req;
  const { query } = req;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.find(query);
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(400);
  }
};

// Get User by id with GET
UserController.user_by_id = async function (req, res) {
  const { headers } = req;
  const { UserId } = req.params;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findById(UserId);
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(400);
  }
};

// Add User with POST
UserController.create = async function (req, res) {
  const { headers } = req;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (err) {
    return res.sendStatus(400);
  }
};

// Update User with PATCH
UserController.update = async function (req, res) {
  const { headers } = req;
  const { UserId } = req.params;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findOneAndUpdate({_id: UserId}, req.body, { new: true });
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(400);
  }
};

// Add User with POST
UserController.delete = async function (req, res) {
  const { headers } = req;
  const { UserId } = req.params;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findByIdAndDelete(UserId);
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(400);
  }
};

function generateAccessToken(user) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ id: user.id, role: user.accessLevel }, CONFIG_AUTH.SECRET, {
    expiresIn: `${CONFIG_AUTH.TOKEN_EXPIRATION_SEC}s`,
  });
}

UserController.createUser = function (req, res) {
  const { firstName, lastName, email } = req.body;
  const { origin } = req.headers;

  const user = new User({
    name: {
      firstName,
      lastName,
    },
    email: email.toLowerCase(),
    accessLevel: 'user',
  });

  // eslint-disable-next-line
  user.save((err, usr) => {
    if (err) {
      res.sendStatus(400);
    }
    res.sendStatus(201);
  });

  const jsonToken = generateAccessToken(user);

  EmailController.sendLoginLink(req.body.email, user.name.firstName, jsonToken, req.cookie, origin);
};

UserController.signin = function (req, res) {
  const { email } = req.body;
  const { origin } = req.headers;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      const jsonToken = generateAccessToken(user);
      EmailController.sendLoginLink(
        req.body.email,
        user.name.firstName,
        jsonToken,
        req.cookie,
        origin,
      );
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);

      return res.status(400);
    });
};

UserController.verifySignIn = async function (req, res) {
  // eslint-disable-next-line dot-notation
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  try {
    const payload = jwt.verify(token, CONFIG_AUTH.SECRET);
    const user = await User.findById(payload.id);
    res.cookie('token', token, { httpOnly: true });
    return res.send(user);
  } catch (err) {
    return res.status(403);
  }
};

UserController.verifyMe = function (req, res) {
  return res.sendStatus(200);
};

module.exports = UserController;
