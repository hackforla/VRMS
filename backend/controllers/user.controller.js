const jwt = require('jsonwebtoken');

const EmailController = require('./email.controller');
const { CONFIG_AUTH } = require('../config');

const { User } = require('../models');

function generateAccessToken(user) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ id: user.id, role: user.accessLevel }, CONFIG_AUTH.SECRET, {
    expiresIn: `${CONFIG_AUTH.TOKEN_EXPIRATION_SEC}s`,
  });
}

function createUser(req, res) {
  const { firstName, lastName, email } = req.body;
  const user = new User({
    name: {
      firstName: firstName,
      lastName: lastName,
    },
    email: email,
    accessLevel: 'user',
  });

  // eslint-disable-next-line
  user.save((err, usr) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    return res.status(200).send({ message: 'User was registered successfully!' });
  });

  const jsonToken = generateAccessToken(user);
  EmailController.sendLoginLink(req.body.email, jsonToken);
}

function signin(req, res) {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'User not authorized' });
      }
      const jsonToken = generateAccessToken(user);
      EmailController.sendLoginLink(req.body.email, jsonToken);
      return res.status(200).send({ message: 'User login link sent to email!' });
    })
    .catch((err) => {
      console.log(err);

      return res.status(400).send({ message: 'User email not found.' });
    });
}

function verifySignIn(req, res) {
  // eslint-disable-next-line dot-notation
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).send({ message: 'Auth token is not supplied' });
  }
  
  try {
    jwt.verify(token, CONFIG_AUTH.SECRET);
    res.cookie('token', token, { httpOnly: true });
    return res.sendStatus(200);
  } catch (err) {
    return res.status(401).send({ message: err });
  }
}

function verifyMe(req, res) {
  res.send(200);
}


const UserController = {
  createUser,
  signin,
  verifySignIn,
  verifyMe,
};

module.exports = UserController;
