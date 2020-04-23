const { check, validationResult } = require('express-validator');
module.exports.create = [
  check('chapter_name').isLength({min: 10, max: 200}).withMessage('Chapter name should be minimum of 10 and maximum of 200 characters long'),
  check('chapter_number').isInt({ min: 1, max: 30}).withMessage('Chapter number should be between 1 to 30'),
  check('semester_id').isInt().withMessage('Semester name is required'),
  check('subject_id').isInt().withMessage('Subject name is required'),
  check('is_active').isBoolean().withMessage('Is active should be either true or false')
]

module.exports.update = [
  check('chapter_id').isInt().withMessage('Chapter id is required'),
  check('chapter_name').isLength({min: 10, max: 200}).withMessage('Chapter name should be minimum of 10 and maximum of 200 characters long'),
  check('chapter_number').isInt({ min: 1, max: 30}).withMessage('Chapter number should be between 1 to 30'),
  check('semester_id').isInt().withMessage('Semester name is required'),
  check('subject_id').isInt().withMessage('Subject name is required'),
  check('is_active').isBoolean().withMessage('Is active should be either true or false')
]

module.exports.delete = [
  check('chapter_id').isInt().withMessage('Chapter id is required')
]

module.exports.getBySlug = [
  check('semester_slug').isAlpha().withMessage('Chapter slug is required'),
]

module.exports.id = [
  check('id').isInt().withMessage('Subject id is required')
]
