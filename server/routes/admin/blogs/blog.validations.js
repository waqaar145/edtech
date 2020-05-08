const { check, oneOf, validationResult } = require('express-validator');

module.exports.create = [
  check('title').isLength({min: 1, max: 500}).withMessage('Title is required & characters length should be between 1 and 500.'),
  check('tags').isArray({min: 0, max: 5}).withMessage('Maximum 5 tags are allowed'),
  check('description').isLength({min: 1, max: 20000}).withMessage('Blog description should be minimum of 1 and maximum of 20,000 characters long'),
  check('is_active').isBoolean().withMessage('Is active should be either true or false')
]

module.exports.edit = [
  check('blog_id').isInt().withMessage('Blog id is required.'),
  check('title').isLength({min: 1, max: 500}).withMessage('Title is required & characters length should be between 1 and 500.'),
  check('tags').isArray({min: 0, max: 5}).withMessage('Maximum 5 tags are allowed'),
  check('description').isLength({min: 1, max: 20000}).withMessage('Blog description should be minimum of 1 and maximum of 20,000 characters long'),
  check('is_active').isBoolean().withMessage('Is active should be either true or false')
]

module.exports.delete = [
  check('blog_id').isInt().withMessage('Blog id is required.')
]

module.exports.getBySlug = [
  check('blog_id').isLength({min: 1}).withMessage('Blog slug is required.')
]
