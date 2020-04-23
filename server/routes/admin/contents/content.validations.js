const { check, oneOf, validationResult } = require('express-validator');

module.exports.create = [
  check('subject_id').isInt().withMessage('Semester id is required.'),
  check('subject_id').isInt().withMessage('Subject id is required.'),
  check('chapter_id').isInt().withMessage('Chapter name is required'),
  check('content_type').isInt({min: 1, max: 2}).withMessage('Content type is required & should be either theory or sum.'),
  check('difficulty_level').isInt({min: 1, max: 3}).withMessage('Difficulty level is required & shoule be only of easy, medium, hard'),
  check('years_asked').isArray({min: 0, max: 3}).withMessage('Years asked must not be greater than 3'),

  check('content_name').isLength({min: 1, max: 10000}).withMessage('Content name should be minimum of 1 and maximum of 10,000 characters long'),
  check('content_slug').isLength({min: 1, max: 500}).withMessage('Content slug should be minimum of 10 and maximum of 500 characters long'),
  check('content_description').isLength({min: 1, max: 20000}).withMessage('Content description should be minimum of 1 and maximum of 20,000 characters long'),
]

module.exports.edit = [
  check('content_id').isInt().withMessage('Content id is required.'),
  check('subject_id').isInt().withMessage('Semester id is required.'),
  check('subject_id').isInt().withMessage('Subject id is required.'),
  check('chapter_id').isInt().withMessage('Chapter name is required'),
  check('content_type').isInt({min: 1, max: 2}).withMessage('Content type is required & should be either theory or sum.'),
  check('difficulty_level').isInt({min: 1, max: 3}).withMessage('Difficulty level is required & shoule be only of easy, medium, hard'),
  check('years_asked').isArray({min: 0, max: 3}).withMessage('Years asked must not be greater than 3'),

  check('content_name').isLength({min: 1, max: 10000}).withMessage('Content name should be minimum of 1 and maximum of 10,000 characters long'),
  check('content_slug').isLength({min: 1, max: 500}).withMessage('Content slug should be minimum of 10 and maximum of 500 characters long'),
  check('content_description').isLength({min: 1, max: 20000}).withMessage('Content description should be minimum of 1 and maximum of 20,000 characters long'),
]

module.exports.delete = [
  check('content_id').isInt().withMessage('Content id is required.')
]

module.exports.getBySlug = [
  check('content_slug').isLength({min: 1}).withMessage('Content slug is required.')
]
