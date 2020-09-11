const CONFIG = require("../config/auth.config");
const DB = require("../models");
const emailController = require("./email.controller");
const User = DB.user;

var jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

function generateAccessToken(user) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ id: user.id, role: user.accessLevel }, CONFIG.SECRET, {
    expiresIn: `${CONFIG.TOKEN_EXPIRATION_SEC}s`,
  });
}

function createUser(req, res) {
  const user = new User({
    name: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    email: req.body.email,
    accessLevel: "user",
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      return res
        .status(200)
        .send({ message: "User was registered successfully!" });
    }
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
        res.status(401).send({ message: "User not authorized" });
      } else {
        const jsonToken = generateAccessToken(user);
        emailController.sendUserEmailSigninLink(req.body.email, jsonToken);
        return res
          .status(200)
          .send({ message: "User login link sent to email!" });
      }
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send({ message: "User email not found." });
    });
}

function verifySignIn(req, res) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "Auth token is not supplied" });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    res.cookie("token", token, { httpOnly: true });
    res.sendStatus(200);
  });
}

function verifyMe(req, res) {
  console.log("-->req.userId: ", req.userId);
  res.send(200);
}

async function validateCreateUserAPICall(req, res, next) {
  await body("name.firstName").not().isEmpty().trim().escape().run(req);
  await body("name.lastName").not().isEmpty().trim().escape().run(req);
  await body("email", "Invalid email")
    .exists()
    .isEmail()
    .normalizeEmail()
    .run(req);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

async function validateSigninUserAPICall(req, res, next) {
  await body("email", "Invalid email")
    .exists()
    .isEmail()
    .normalizeEmail()
    .run(req);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

userController = {
  validateCreateUserAPICall,
  validateSigninUserAPICall,
  createUser,
  signin,
  verifySignIn,
  verifyMe,
};

module.exports = userController;
