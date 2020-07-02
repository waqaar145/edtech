const { check, validationResult } = require('express-validator');

module.exports.delete = [
  check('blog_id').isInt().withMessage('Blog id is required.')
]

module.exports.getBySlug = [
  check('blog_id').isLength({min: 1}).withMessage('Blog slug is required.')
]
