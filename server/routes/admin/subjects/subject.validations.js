const { check, validationResult } = require('express-validator');
module.exports.slugValidation = [
  check('subject_slug').isAlpha().withMessage('Subject slug is required'),
]

module.exports.idValidation = [
  check('subject_id').isInt().withMessage('Id is required'),
]

module.exports.semesterIdValidation = [
  check('semester_id').isInt().withMessage('Id is required'),
]
