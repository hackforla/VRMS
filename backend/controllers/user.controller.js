const jwt = require('jsonwebtoken');

const EmailController = require('./email.controller');
const { CONFIG_AUTH } = require('../config');

const { User } = require('../models');


const UserController = {};

// // Get list of Users with GET
// UserController.user_list = async function (req, res) {
//   return res.sendStatus('NOT IMPLEMENTED: Get next Project for Project GET');
// };

// // Get User by id with GET
// UserController.user_by_id = async function (req, res) {
//   return res.sendStatus('NOT IMPLEMENTED: Get next Project for Project GET');
// };

// Add User with POST
UserController.create = async function (req, res) {
  const { headers } = req;

  if (headers['x-customrequired-header'] !== process.env.CUSTOM_REQUEST_HEADER) {
    return res.sendStatus(401);
  } 

  try {
    const user = User.create(req.body);
    return res.status(201).send(user)
  } catch (err){
    return res.sendStatus(400)
  }
 
};

// // Update User with PATCH
// UserController.update = async function (req, res) {
//   return res.sendStatus('NOT IMPLEMENTED: Get next Project for Project GET');
// };

function generateAccessToken(user) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ id: user.id, role: user.accessLevel }, CONFIG_AUTH.SECRET, {
    expiresIn: `${CONFIG_AUTH.TOKEN_EXPIRATION_SEC}s`,
  });
};

UserController.createUser = function (req, res) {
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
};

UserController.signin = function (req, res) {
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
};

UserController.verifySignIn = function (req, res) {
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
};

UserController.verifyMe = function (req, res) {
  res.send(200);
};


module.exports = UserController;
