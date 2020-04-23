const knex = require('./../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../messages/error');
const { fileUpload } = require('./../../../helpers/multiple_file_upload');
const fileUploadNow = fileUpload.single('thumbnail');
const config = require('./../../../config/config')
const { convertIntoSlug } = require('./../../../helpers/slug')

module.exports.getSubjects = async (req, res, next) => {
  try {
    let result = await knex.select(
                            'ed_subjects.sb_id as id',
                            'ed_subjects.sb_name as name',
                            'ed_subjects.sb_slug as slug',
                            'ed_subjects.sb_thumbnail as thumbnail',
                            'ed_subjects.sb_is_active as is_active',
                            'ed_semesters.sm_id as semester_id',
                            'ed_semesters.sm_name as semester_name',
                            'ed_admins.a_id as admin_id',
                            'ed_admins.a_email as admin_email',
                            'ed_admins.a_name as admin_name'
                          ).from('ed_subjects')
                          .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_subjects.sb_admin_id')
                          .innerJoin('ed_semesters', 'ed_semesters.sm_id', 'ed_subjects.sb_semester_id')
                          .where('ed_subjects.sb_is_deleted', false)
                          .orderBy('ed_subjects.sb_id', 'ASC')

    return res.status(200).send({
      message: 'Subjects list has been fetched',
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

module.exports.createSubject = async (req, res, next) => {
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
      await check('subject_name').isLength({ min: 3, max: 50}).withMessage('Subject name must be at least 3 or maximum 50 characters long').trim().escape().run(req);
      await check('semester_id').isInt().withMessage('Semester name is required').trim().escape().run(req);
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
      const { subject_name, semester_id, is_active} = req.body;
      let slug = convertIntoSlug(subject_name); // slug for subject
      let loggedin_user = req.user.uid;

      let check_slug = await knex('ed_subjects').where('sb_slug', slug).first();
      if (check_slug) {
        return res.status(422).send(unExpectedError(
          'This subject name already exists.',
          'This subject name already exists.',
          'subject'
        ))
      }

      let subject_obj = { // object to be inserted into database
        sb_name: subject_name,
        sb_semester_id: semester_id,
        sb_slug: slug,
        sb_thumbnail: image_path,
        sb_admin_id: loggedin_user,
        sb_is_active: is_active
      }

      let result = await knex('ed_subjects').insert(subject_obj).returning('*');
      if (result) {
        let object = {
          subject_name: result[0].sb_name,
          semester_id: result[0].sb_semester_id,
          slug: result[0].sb_slug,
          thumbnail: result[0].sb_thumbnail,
          is_active: result[0].sb_is_active,
        }

        return res.status(200).send({
          message: 'Subject details is saved successfully',
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

module.exports.getSubjectBySlug = async (req, res, next) => {
  try {
    let subject_slug = req.params.subject_slug;
    let subject = await knex('ed_subjects').where('sb_slug', subject_slug).first();
    let semester = await knex('ed_semesters').select('sm_name as semester_name').where('sm_id', subject.sb_semester_id).first();
    if (subject) {
      let object = {
        subject_id: subject.sb_id,
        subject_name: subject.sb_name,
        semester_id: subject.sb_semester_id,
        semester_name: semester.semester_name,
        slug: subject.sb_slug,
        thumbnail: subject.sb_thumbnail,
        is_active: subject.sb_is_active,
      }

      return res.status(200).send({
        message: 'Subject by slug has been fetched',
        data: object
      })
    } else {
      return res.status(404).send(unExpectedError(
        'Subject could not be found',
        'Subject could not be found',
        'subject'
      ))
    }
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to fetch subject by slug again',
      'Something went wrong, please try to fetch subject by slug again',
      'subject'
    ))
  }
}

module.exports.updateSubjectBySlug = async (req, res, next) => {
  fileUploadNow(req, res, async function (err) {
    if (err) {
      return res.status(422).send(unExpectedError(
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'image'
      ))
    }

    try {
      await check('subject_id').isInt().withMessage('Id should be a number').run(req);
      await check('subject_name').isLength({ min: 3, max: 50}).withMessage('Subject name must be at least 3 or maximum 50 characters long').trim().escape().run(req);
      await check('semester_id').isInt().withMessage('Semester name is required.').run(req);
      await check('is_active').isBoolean().withMessage('Is active should be either true or false').run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({
          message: 'Got error while submitting',
          data: errors.array()
        });
      }

      let loggedin_user = req.user.uid;
      const { subject_name, semester_id , is_active } = req.body;
      const { subject_id } = req.params;
      let slug = convertIntoSlug(subject_name); // slug for semester

      let check_slug = await knex('ed_subjects').where('sb_slug', slug).first();
      if (check_slug && check_slug.sb_admin_id !== loggedin_user) {
        return res.status(422).send(unExpectedError(
          'This subject name already exists.',
          'This subject name already exists.',
          'subject'
        ))
      }

      let data = {};
      if (!req.file) {
        data = {
          sb_name: subject_name,
          sb_semester_id: semester_id,
          sb_slug: slug,
          sb_is_active: is_active
        }
      } else {
        let image_path = config.SERVER_URL + '/' + req.file.filename;
        data = {
          sb_name: subject_name,
          sb_semester_id: semester_id,
          sb_slug: slug,
          sb_thumbnail: image_path,
          sb_is_active: is_active
        }
      }

      let result = await knex('ed_subjects').update(data).where('sb_id', subject_id).returning('*');
      if (result) {
        let object = {
          subject_id: result[0].sb_id,
          subject_name: result[0].sb_name,
          slug: result[0].sb_slug,
          thumbnail: result[0].sb_thumbnail,
          is_active: result[0].sb_is_active,
        }

        return res.status(200).send({
          message: 'Subject details is updated successfully',
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

module.exports.deleteSubjectById = async (req, res) => {
  try {
    const { subject_id } = req.params;
    let result = await knex('ed_subjects').update({sb_is_deleted: true}).where('sb_id', subject_id);
    if (result) {
      return res.status(200).send({
        message: 'Subject has been deleted successfully',
        data: result
      })
    }

    return res.status(404).send(unExpectedError(
      'Subject does not exists',
      'Subject does not exists',
      'subject'
    ))
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}

module.exports.getAllSubjectsBySemesterId = async (req, res) => {
  try {
    let semester_id = req.params.semester_id;

    let semester = await knex('ed_semesters').where('sm_id', semester_id).first();
    if (!semester) {
      return res.status(404).send(unExpectedError(
        'Semester does not exists',
        'Semester does not exists',
        'semester'
      ))
    }

    let result = await knex.select(
                            'ed_subjects.sb_id as id',
                            'ed_subjects.sb_name as name',
                            'ed_subjects.sb_slug as slug',
                            'ed_subjects.sb_thumbnail as thumbnail',
                            'ed_subjects.sb_is_active as is_active',
                            'ed_semesters.sm_id as semester_id',
                            'ed_semesters.sm_name as semester_name',
                            'ed_admins.a_id as admin_id',
                            'ed_admins.a_email as admin_email',
                            'ed_admins.a_name as admin_name'
                          ).from('ed_subjects')
                          .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_subjects.sb_admin_id')
                          .innerJoin('ed_semesters', 'ed_semesters.sm_id', 'ed_subjects.sb_semester_id')
                          .where('ed_subjects.sb_semester_id', semester_id)
                          .where('ed_subjects.sb_is_deleted', false)
                          .orderBy('ed_subjects.sb_id', 'ASC');

      return res.status(200).send({
        message: 'Subjects list has been fetched',
        data: result
      });
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}
