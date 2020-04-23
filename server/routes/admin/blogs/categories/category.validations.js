const { check, validationResult } = require('express-validator');
module.exports.slugValidation = [
  check('category_slug').isAlpha().withMessage('Category slug is required'),
]

module.exports.idValidation = [
  check('category_id').isInt().withMessage('Id is required'),
]
