const { check, validationResult } = require('express-validator');
const signupValidation = [
  check('name').isLength({ min: 3, max: 35}).withMessage('Name must be at least 3 or maximum 35 characters long').trim().escape(),
  check('email').isEmail().withMessage('Email must be a valid email').trim().escape(),
  check('password').isLength({ min: 6, max: 20 }).withMessage('Password must be at least 6 or maximum 20 chars long').trim().escape()
];

const signinValidation = [
  check('email').isEmail().withMessage('Email must be a valid email').trim().escape(),
  check('password').isLength({ min: 6, max: 20 }).withMessage('Password must be at least 6 or maximum 20 chars long').trim().escape()
];

module.exports = { signupValidation, signinValidation };
