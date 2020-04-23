const { check, validationResult } = require('express-validator');
module.exports.slugValidation = [
  check('semester_slug').isAlpha().withMessage('Semester slug is required'),
]

module.exports.idValidation = [
  check('semester_id').isInt().withMessage('Id is required'),
]
