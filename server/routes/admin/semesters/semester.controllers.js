const knex = require('./../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../messages/error');
const bcrypt = require('bcryptjs');
const { fileUpload } = require('./../../../helpers/multiple_file_upload');
const fileUploadNow = fileUpload.single('thumbnail');
const config = require('./../../../config/config')
const { convertIntoSlug } = require('./../../../helpers/slug')

module.exports.getSemesters = async (req, res, next) => {
  try {
    let result = await knex.select(
                            'ed_semesters.sm_id as id',
                            'ed_semesters.sm_name as name',
                            'ed_semesters.sm_slug as slug',
                            'ed_semesters.sm_thumbnail as thumbnail',
                            'ed_semesters.sm_is_active as is_active',
                            'ed_admins.a_id as admin_id',
                            'ed_admins.a_email as admin_email',
                            'ed_admins.a_name as admin_name'
                          ).from('ed_semesters')
                          .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_semesters.sm_admin_id')
                          .where('ed_semesters.sm_is_deleted', false)
                          .orderBy('ed_semesters.sm_id', 'ASC')

    return res.status(200).send({
      message: 'Semesters list has been fetched',
      data: result
    })
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to fetch again',
      'Something went wrong, please try to fetch again',
      'semester'
    ))
  }
}

module.exports.createSemester = async (req, res, next) => {
  fileUploadNow(req, res, async function (err) {
    if (err) {
      return res.status(422).send(unExpectedError(
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'image'
      ))
    }

    if (!req.file) { // if there is no file or error in file
      return res.status(422).send(unExpectedError(
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'image'
      ))
    }
    try {
      await check('semester_name').isLength({ min: 3, max: 50}).withMessage('Semester name must be at least 3 or maximum 50 characters long').trim().escape().run(req);
      await check('is_active').isBoolean().withMessage('Is active should be either true or false').run(req);

      const errors = validationResult(req); // validating req.body against a predefined set of rules
      if (!errors.isEmpty()) {
        return res.status(422).send({
          message: 'Got error while submitting',
          data: errors.array()
        });
      }
      // thumbnail path,
      // will be served from express server
      let image_path = config.SERVER_URL + '/' + req.file.filename;
      const { semester_name, is_active} = req.body;
      let slug = convertIntoSlug(semester_name); // slug for semester
      let loggedin_user = req.user.uid;

      let check_slug = await knex('ed_semesters').where('sm_slug', slug).first();
      if (check_slug) {
        return res.status(422).send(unExpectedError(
          'This semester name already exists.',
          'This semester name already exists.',
          'semester'
        ))
      }

      let semester_obj = { // object to be inserted into database
        sm_name: semester_name,
        sm_slug: slug,
        sm_thumbnail: image_path,
        sm_admin_id: loggedin_user,
        sm_is_active: is_active
      }

      let result = await knex('ed_semesters').insert(semester_obj).returning('*');
      if (result) {
        let object = {
          semester_name: result[0].sm_name,
          slug: result[0].sm_slug,
          thumbnail: result[0].sm_thumbnail,
          is_active: result[0].sm_is_active,
        }

        return res.status(200).send({
          message: 'Semester details is saved successfully',
          data: object
        })
      }
    } catch (err) {
      return res.status(422).send(unExpectedError(
        'Something went wrong, please try to add details again',
        'Something went wrong, please try to add details again',
        'semester'
      ))
    }

  })
}

module.exports.getSemesterBySlug = async (req, res, next) => {
  try {
    let semester_slug = req.params.semester_slug;
    let semester = await knex('ed_semesters').where('sm_slug', semester_slug).first();
    if (semester) {
      let object = {
        semester_id: semester.sm_id,
        semester_name: semester.sm_name,
        slug: semester.sm_slug,
        thumbnail: semester.sm_thumbnail,
        is_active: semester.sm_is_active,
      }

      return res.status(200).send({
        message: 'Semester by slug has been fetched',
        data: object
      })
    } else {
      return res.status(404).send(unExpectedError(
        'Semester could not be found',
        'Semester could not be found',
        'semester'
      ))
    }
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to fetch semester by slug again',
      'Something went wrong, please try to fetch semester by slug again',
      'semester'
    ))
  }
}

module.exports.updateSemesterBySlug = async (req, res, next) => {
  fileUploadNow(req, res, async function (err) {
    if (err) {
      return res.status(422).send(unExpectedError(
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'image'
      ))
    }

    try {
      await check('semester_id').isInt().withMessage('Id should be a number').run(req);
      await check('semester_name').isLength({ min: 3, max: 50}).withMessage('Semester name must be at least 3 or maximum 50 characters long').trim().escape().run(req);
      await check('is_active').isBoolean().withMessage('Is active should be either true or false').run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({
          message: 'Got error while submitting',
          data: errors.array()
        });
      }

      let loggedin_user = req.user.uid;
      const { semester_name, is_active } = req.body;
      const { semester_id } = req.params;
      let slug = convertIntoSlug(semester_name); // slug for semester

      let check_slug = await knex('ed_semesters').where('sm_slug', slug).first();
      if (check_slug && check_slug.sm_admin_id !== loggedin_user) {
        return res.status(422).send(unExpectedError(
          'This semester name already exists.',
          'This semester name already exists.',
          'semester'
        ))
      }

      let data = {};
      if (!req.file) {
        data = {
          sm_name: semester_name,
          sm_slug: slug,
          sm_is_active: is_active
        }
      } else {
        let image_path = config.SERVER_URL + '/' + req.file.filename;
        data = {
          sm_name: semester_name,
          sm_slug: slug,
          sm_thumbnail: image_path,
          sm_is_active: is_active
        }
      }

      let result = await knex('ed_semesters').update(data).where('sm_id', semester_id).returning('*');
      if (result) {
        let object = {
          semester_id: result[0].sm_id,
          semester_name: result[0].sm_name,
          slug: result[0].sm_slug,
          thumbnail: result[0].sm_thumbnail,
          is_active: result[0].sm_is_active,
        }

        return res.status(200).send({
          message: 'Semester details is updated successfully',
          data: object
        })
      }
    } catch (err) {
      return res.status(422).send(unExpectedError(
        'Something went wrong, please try to add details again',
        'Something went wrong, please try to add details again',
        'semester'
      ))
    }
  })
}

module.exports.deleteSemesterById = async (req, res) => {
  try {
    const { semester_id } = req.params;
    let result = await knex('ed_semesters').update({sm_is_deleted: true}).where('sm_id', semester_id);
    if (result) {
      return res.status(200).send({
        message: 'Semester has been deleted successfully',
        data: result
      })
    }

    return res.status(404).send(unExpectedError(
      'Semester does not exists',
      'Semester does not exists',
      'semester'
    ))
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}
