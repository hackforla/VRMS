const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const emailController = require('./email.controller');
const CONFIG = require('../config/');
const AUTH = CONFIG.AUTH_CONFIG;

const DB = require('../models');

const User = DB.user;

function generateAccessToken(user) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ id: user.id, role: user.accessLevel }, AUTH.SECRET, {
    expiresIn: `${AUTH.TOKEN_EXPIRATION_SEC}s`,
  });
}

function createUser(req, res) {
  const user = new User({
    name: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    email: req.body.email,
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
  emailController.sendUserEmailSigninLink(req.body.email, jsonToken);
}

function signin(req, res) {
  const { email } = req.body;
  console.log(email);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'User not authorized' });
      }
      const jsonToken = generateAccessToken(user);
      emailController.sendUserEmailSigninLink(req.body.email, jsonToken);
      return res.status(200).send({ message: 'User login link sent to email!' });
    })
    .catch((err) => {
      console.log(err);

      return res.status(400).send({ message: 'User email not found.' });
    });
}

function verifySignIn(req, res) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'Auth token is not supplied' });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    res.cookie('token', token, { httpOnly: true });
    res.sendStatus(200);
  });
}

function verifyMe(req, res) {
  res.send(200);
}

async function validateCreateUserAPICall(req, res, next) {
  await body('name.firstName').not().isEmpty().trim().escape().run(req);
  await body('name.lastName').not().isEmpty().trim().escape().run(req);
  await body('email', 'Invalid email').exists().isEmail().normalizeEmail({ gmail_remove_dots: false }).run(req);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

async function validateSigninUserAPICall(req, res, next) {
  await body('email', 'Invalid email').exists().isEmail().normalizeEmail({ gmail_remove_dots: false }).run(req);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

const userController = {
  validateCreateUserAPICall,
  validateSigninUserAPICall,
  createUser,
  signin,
  verifySignIn,
  verifyMe,
};

module.exports = userController;
