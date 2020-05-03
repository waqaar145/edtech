const knex = require('./../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../messages/error');
const config = require('./../../../config/config')
const { convertIntoSlug } = require('./../../../helpers/slug')

module.exports.getYears = async (req, res) => {
  try {
    let result = await knex('ed_years').select('y_id as id', 'y_month as month', 'y_year as year').returning('*');
    let final_result = result.map(year => {
      return {
        id: year.id,
        year: year.month + ' ' + year.year
      }
    });

    return res.status(200).send({
      message: 'Years list fetched',
      data: final_result
    })
  } catch (err) {
    return res.status(422).send(
      unExpectedError(
        'Years list could not be fetched',
        'Years list could not be fetched',
        'year'
      )
    )
  }
}

module.exports.getContents = async (req, res) => {
  try {
    let result = await knex.select(
                              'ed_contents.cn_id as id',
                              'ed_contents.cn_type as content_type',
                              'ed_contents.cn_difficulty_level as difficulty_level',
                              'ed_contents.cn_name as name',
                              'ed_contents.cn_slug as slug',
                              'ed_contents.cn_description as description',
                              'ed_contents.cn_is_active as is_active',
                              'ed_admins.a_name as admin_name',

                              'ed_semesters.sm_id as semester_id',
                              'ed_semesters.sm_name as semester_name',

                              'ed_subjects.sb_id as subject_id',
                              'ed_subjects.sb_name as subject_name',

                              'ed_chapters.cp_id as chapter_id',
                              'ed_chapters.cp_name as chapter_name',
                            ).from('ed_contents')
                            .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_contents.cn_admin_id')
                            .innerJoin('ed_semesters', 'ed_semesters.sm_id', 'ed_contents.cn_semester_id')
                            .innerJoin('ed_subjects', 'ed_subjects.sb_id', 'ed_contents.cn_subject_id')
                            .innerJoin('ed_chapters', 'ed_chapters.cp_id', 'ed_contents.cn_chapter_id')
                            .where('ed_contents.cn_is_deleted', false)
                            .orderBy('ed_contents.cn_id', 'DESC');

    return res.status(200).send({
      message: 'Content list have been fetched',
      data: result
    })

  } catch (err) {
    return res.status(422).send(
      unExpectedError(
        'Years list could not be fetched',
        'Years list could not be fetched',
        'year'
      )
    )
  }
}

module.exports.createContent = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({
      message: 'Got error while submitting',
      data: errors.array()
    });
  }

  let trx = await knex.transaction();
  try {
    let loggedin_user = req.user.uid;
    const {semester_id, subject_id, chapter_id, content_type, difficulty_level, years_asked, content_name, content_slug, content_description, is_active} = req.body;

    let semester = await knex('ed_semesters').where('sm_id', semester_id).first();
    if (!semester) {
      return res.status(422).send(
        unExpectedError(
          'Semester does not exist',
          'Semester does not exist',
          'semester'
        )
      )
    }

    let subject = await knex('ed_subjects').where('sb_id', subject_id).first();
    if (!subject) {
      return res.status(422).send(
        unExpectedError(
          'Subject does not exist',
          'Subject does not exist',
          'subject'
        )
      )
    }

    let chapter = await knex('ed_chapters').where('cp_id', chapter_id).first();
    if (!chapter) {
      return res.status(422).send(
        unExpectedError(
          'Chapter does not exist',
          'Chapter does not exist',
          'Chapter'
        )
      )
    }


    let slug = convertIntoSlug(content_slug);

    let obj = {
      cn_semester_id: semester_id,
      cn_subject_id: subject_id,
      cn_chapter_id: chapter_id,
      cn_type: content_type,
      cn_difficulty_level: difficulty_level,
      cn_name: content_name,
      cn_slug: slug,
      cn_description: content_description,
      cn_admin_id: loggedin_user,
      cn_is_active: is_active
    }

    let content = await trx('ed_contents').insert(obj).returning('*');

    let content_id = content[0].cn_id;

    let years_asked_arr = [];
    for (let y of years_asked) {
      years_asked_arr.push({
        cy_content_id: content_id,
        cy_year_id: y
      })
    }

    let years_asked_result = await trx('ed_content_years').insert(years_asked_arr).returning('*');
    trx.commit();
    return res.status(200).send({
      message: 'Content is saved successfully',
      data: ''
    })

  } catch (err) {
    trx.rollback();
    return res.status(422).send(
      unExpectedError(
        'Content could not be saved, please try again',
        'Content could not be saved, please try again',
        'error'
      )
    )
  }
}

module.exports.getContentBySlug = async (req, res) => {
  try {
    let {content_slug} = req.params;
    let content = await knex('ed_contents').where('cn_slug', content_slug).first();
    let semester = await knex('ed_semesters').select('sm_name as semester_name').where('sm_id', content.cn_semester_id).first();
    let subject = await knex('ed_subjects').select('sb_name as subject_name').where('sb_id', content.cn_subject_id).first();
    let chapter = await knex('ed_chapters').select('cp_name as chapter_name').where('cp_id', content.cn_chapter_id).first();

    let years_asked_ids = await knex('ed_content_years').select('cy_year_id as id').where('cy_content_id', content.cn_id).returning('*');

    let ids = [];
    for (let y of years_asked_ids) {
      ids.push(y.id)
    }

    let years_asked = await knex('ed_years').whereIn('y_id', ids).returning('*');

    let year_month_arr = [];
    for (let y of years_asked) {
      year_month_arr.push({
        value: y.y_id,
        label: y.y_month + ' ' + y.y_year
      })
    }

    if (content) {
      let content_type_value_label = {
        value: content.cn_type,
        label: content.cn_type.toString()
      }

      let difficulty_level_label_value = {
        value: content.cn_difficulty_level
      };
      if (content.cn_difficulty_level === 1) {
        difficulty_level_label_value.label = 'Easy'
      } else if (content.cn_difficulty_level === 2) {
        difficulty_level_label_value.label = 'Medium'
      } else {
        difficulty_level_label_value.label = 'Hard'
      }

      let object = {
        id: content.cn_id,
        content_name: content.cn_name,
        content_slug: content.cn_slug,
        content_description: content.cn_description,
        content_type: content_type_value_label,
        difficulty_level: difficulty_level_label_value,
        years_asked: year_month_arr,

        semester: {
          value: content.cn_semester_id,
          label: semester.semester_name
        },

        subject: {
          value: content.cn_subject_id,
          label: subject.subject_name
        },

        chapter: {
          value: content.cn_chapter_id,
          label: chapter.chapter_name
        },

        is_active: content.cn_is_active,
      }

      return res.status(200).send({
        message: 'Content by slug has been fetched',
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

module.exports.editContent = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({
      message: 'Got error while submitting',
      data: errors.array()
    });
  }

  let trx = await knex.transaction();
  try {
    let loggedin_user = req.user.uid;
    let content_id = req.params.content_id;
    const {semester_id, subject_id, chapter_id, content_type, difficulty_level, years_asked, content_name, content_slug, content_description, is_active} = req.body;

    let semester = await knex('ed_semesters').where('sm_id', semester_id).first();
    if (!semester) {
      return res.status(422).send(
        unExpectedError(
          'Semester does not exist',
          'Semester does not exist',
          'semester'
        )
      )
    }

    let subject = await knex('ed_subjects').where('sb_id', subject_id).first();
    if (!subject) {
      return res.status(422).send(
        unExpectedError(
          'Subject does not exist',
          'Subject does not exist',
          'subject'
        )
      )
    }

    let chapter = await knex('ed_chapters').where('cp_id', chapter_id).first();
    if (!chapter) {
      return res.status(422).send(
        unExpectedError(
          'Chapter does not exist',
          'Chapter does not exist',
          'Chapter'
        )
      )
    }


    let slug = convertIntoSlug(content_slug);

    let obj = {
      cn_semester_id: semester_id,
      cn_subject_id: subject_id,
      cn_chapter_id: chapter_id,
      cn_type: content_type,
      cn_difficulty_level: difficulty_level,
      cn_name: content_name,
      cn_slug: slug,
      cn_description: content_description,
      cn_admin_id: loggedin_user,
      cn_is_active: is_active
    }

    let content = await trx('ed_contents').where('cn_id', content_id).update(obj).returning('*');

    let years_asked_arr = [];
    for (let y of years_asked) {
      years_asked_arr.push({
        cy_content_id: content_id,
        cy_year_id: y
      })
    }

    let years_asked_delete = await trx('ed_content_years').where('cy_content_id', content_id).del().returning('*');
    let years_asked_result = await trx('ed_content_years').insert(years_asked_arr).returning('*');

    trx.commit();
    return res.status(200).send({
      message: 'Content is updated successfully',
      data: {
        slug: content[0].cn_slug
      }
    })

  } catch (err) {
    trx.rollback();
    return res.status(422).send(
      unExpectedError(
        'Content could not be saved, please try again',
        'Content could not be saved, please try again',
        'error'
      )
    )
  }
}

module.exports.deleteContent = async (req, res) => {
  try {
    const { content_id } = req.params;
    let result = await knex('ed_contents').update({cn_is_deleted: true}).where('cn_id', content_id);
    if (result) {
      return res.status(200).send({
        message: 'Content has been deleted successfully',
        data: result
      })
    }

    return res.status(404).send(unExpectedError(
      'Content does not exist',
      'Content does not exist',
      'content'
    ))
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}
