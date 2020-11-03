const { body, validationResult } = require('express-validator');

async function validateCreateUserAPICall(req, res, next) {
  await body('name.firstName').not().isEmpty().trim().escape().run(req);
  await body('name.lastName').not().isEmpty().trim().escape().run(req);
  await body('email', 'Invalid email')
    .exists()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  return next();
}

async function validateSigninUserAPICall(req, res, next) {
  await body('email', 'Invalid email')
    .exists()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false })
    .run(req);

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  return next();
}

const authAPIValidator = {
  validateCreateUserAPICall,
  validateSigninUserAPICall,
};

module.exports = authAPIValidator;
