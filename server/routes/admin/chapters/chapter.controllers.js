const knex = require('./../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../messages/error');
const config = require('./../../../config/config')
const { convertIntoSlug } = require('./../../../helpers/slug')


module.exports.getChapters = async (req, res) => {
  try {
    let result = await knex.select(
                            'ed_chapters.cp_id as id',
                            'ed_chapters.cp_name as chapter_name',
                            'ed_chapters.cp_number as chapter_number',
                            'ed_chapters.cp_slug as slug',
                            'ed_chapters.cp_is_active as is_active',
                            'ed_semesters.sm_id as semester_id',
                            'ed_semesters.sm_name as semester_name',
                            'ed_subjects.sb_id as subject_id',
                            'ed_subjects.sb_name as subject_name',
                            'ed_admins.a_id as admin_id',
                            'ed_admins.a_email as admin_email',
                            'ed_admins.a_name as admin_name'
                          ).from('ed_chapters')
                          .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_chapters.cp_admin_id')
                          .innerJoin('ed_semesters', 'ed_semesters.sm_id', 'ed_chapters.cp_semester_id')
                          .innerJoin('ed_subjects', 'ed_subjects.sb_id', 'ed_chapters.cp_subject_id')
                          .where('ed_chapters.cp_is_deleted', false)
                          .orderBy('ed_chapters.cp_id', 'ASC')

    return res.status(200).send({
      message: 'Chapters list has been fetched',
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

module.exports.createChapter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        message: 'Got error while submitting',
        data: errors.array()
      });
    }

    let loggedin_user = req.user.uid;
    const { chapter_name, chapter_number, semester_id, subject_id, is_active } = req.body;
    let slug = convertIntoSlug(chapter_name);
    let check_chapter_slug = await knex('ed_chapters').where('cp_slug', slug).first();
    if (check_chapter_slug) {
      return res.status(422).send(
        unExpectedError(
          'Chapter does already exists',
          'Chapter does already exists',
          'chapter'
        )
      )
    }

    let check_chapter_number = await knex('ed_chapters').where('cp_number', chapter_number).andWhere('cp_subject_id', subject_id).first();
    if (check_chapter_number) {
      return res.status(422).send(
        unExpectedError(
          'Chapter number does already exists for selected subject',
          'Chapter number does already exists for selected subject',
          'chapter'
        )
      )
    }

    let check_semester = await knex('ed_semesters').where('sm_id', semester_id).first();
    if (!check_semester) {
      return res.status(404).send(
        unExpectedError(
          'Semester does not exists',
          'Semester does not exists',
          'semester'
        )
      )
    }

    let check_subject = await knex('ed_subjects').where('sb_id', subject_id).first();
    if (!check_subject) {
      return res.status(404).send(
        unExpectedError(
          'Subject does not exists',
          'Subject does not exists',
          'subject'
        )
      )
    }

    let chapter_object = {
      cp_name: chapter_name,
      cp_number: Number(chapter_number),
      cp_semester_id: semester_id,
      cp_subject_id: subject_id,
      cp_slug: slug,
      cp_admin_id: loggedin_user,
      cp_is_active: is_active
    }

    let result = await knex('ed_chapters').insert(chapter_object).returning('*');
    if (result) {
      let object = {
        chapter_name: result[0].cp_name,
        chapter_number: result[0].cp_number,
        semester_id: result[0].cp_semester_id,
        subject_id: result[0].cp_subject_id,
        is_active: result[0].cp_is_active
      }
      return res.status(200).send({
        message: 'Chapter is saved successfully!',
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
}

module.exports.getChapterBySlug = async (req, res) => {
  try {
    let chapter_slug = req.params.chapter_slug;
    let chapter = await knex('ed_chapters').where('cp_slug', chapter_slug).first();
    let semester = await knex('ed_semesters').select('sm_name as semester_name').where('sm_id', chapter.cp_semester_id).first();
    let subject = await knex('ed_subjects').select('sb_name as subject_name').where('sb_id', chapter.cp_subject_id).first();

    if (chapter) {
      let object = {
        chapter_id: chapter.cp_id,
        chapter_name: chapter.cp_name,
        chapter_number: chapter.cp_number,
        slug: chapter.cp_slug,
        semester_id: chapter.cp_semester_id,
        semester_name: semester.semester_name,
        subject_id: chapter.cp_subject_id,
        subject_name: subject.subject_name,
        is_active: chapter.cp_is_active,
      }

      return res.status(200).send({
        message: 'Chapter by slug has been fetched',
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

module.exports.updateChapterById = async (req, res) => {
  // try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        message: 'Got error while submitting',
        data: errors.array()
      });
    }

    let loggedin_user = req.user.uid;
    const { chapter_name, chapter_number, semester_id, subject_id, is_active } = req.body;
    const { chapter_id } = req.params;
    let slug = convertIntoSlug(chapter_name);

    let check_chapter_number = await knex('ed_chapters').where('cp_number', chapter_number).whereNot('cp_subject_id', subject_id).first();
    if (check_chapter_number) {
      if (check_chapter_number.cp_id === chapter_id) {
        return res.status(422).send(
          unExpectedError(
            'Chapter number does already exists',
            'Chapter number does already exists',
            'chapter'
          )
        )
      }
    }

    let check_semester = await knex('ed_semesters').where('sm_id', semester_id).first();
    if (!check_semester) {
      return res.status(404).send(
        unExpectedError(
          'Semester does not exists',
          'Semester does not exists',
          'semester'
        )
      )
    }

    let check_subject = await knex('ed_subjects').where('sb_id', subject_id).first();
    if (!check_subject) {
      return res.status(404).send(
        unExpectedError(
          'Subject does not exists',
          'Subject does not exists',
          'subject'
        )
      )
    }

    let check_slug = await knex('ed_chapters').where('cp_slug', slug).first();

    if (check_slug && check_slug.cp_admin_id !== loggedin_user) {
      return res.status(422).send(unExpectedError(
        'This chapter name already exists.',
        'This chapter name already exists.',
        'chapter'
      ))
    }

    let chapter_object = {
      cp_name: chapter_name,
      cp_number: Number(chapter_number),
      cp_semester_id: semester_id,
      cp_subject_id: subject_id,
      cp_slug: slug,
      cp_is_active: is_active
    }

    let result = await knex('ed_chapters').update(chapter_object).where('cp_id', chapter_id).returning('*');
    if (result) {
      let object = {
        chapter_id: result[0].cp_id,
        chapter_name: result[0].cp_name,
        chapter_number: result[0].cp_number,
        slug: result[0].cp_slug,
        semester_id: result[0].cp_semester_id,
        semester_name: check_semester.semester_name,
        subject_id: result[0].cp_subject_id,
        subject_name: check_subject.subject_name,
        is_active: result[0].cp_is_active,
      }

      return res.status(200).send({
        message: 'Chapter details have been updated',
        data: object
      })
    }
  // } catch (err) {
  //   return res.status(422).send(unExpectedError(
  //     'Something went wrong, please try to update chapter again',
  //     'Something went wrong, please try to update chapter again',
  //     'chapter'
  //   ))
  // }
}

module.exports.deleteChapterById = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    let result = await knex('ed_chapters').update({cp_is_deleted: true}).where('cp_id', chapter_id);
    if (result) {
      return res.status(200).send({
        message: 'Chapter has been deleted successfully',
        data: result
      })
    }

    return res.status(404).send(unExpectedError(
      'Chapter does not exists',
      'Chapter does not exists',
      'chapter'
    ))
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}

module.exports.getChaptersBySubjectId = async (req, res) => {
  try {
    let subject_id = req.params.subject_id;

    let subject = await knex('ed_subjects').where('sb_id', subject_id).first();
    if (!subject) {
      return res.status(404).send(unExpectedError(
        'Subject does not exists',
        'Subject does not exists',
        'subject'
      ))
    }

    let result = await knex.select(
                            'ed_chapters.cp_id as id',
                            'ed_chapters.cp_name as chapter_name',
                          ).from('ed_chapters')
                          .where('ed_chapters.cp_subject_id', subject_id)
                          .orderBy('ed_chapters.cp_id', 'ASC')

    return res.status(200).send({
      message: 'Subject list has been fetched',
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
