const knex = require('./../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../messages/error');
const config = require('./../../../config/config')
const { convertIntoSlug } = require('./../../../helpers/slug')

module.exports.getBlogs = async (req, res) => {
  try {
    let result = await knex.select(
                              'ed_blogs.b_id as id',
                              'ed_blogs.b_title as title',
                              'ed_blogs.b_description as description',
                              'ed_blogs.b_slug as slug',
                              'ed_blogs.b_is_active as is_active',
                              'ed_admins.a_name as admin_name'
                            ).from('ed_blogs')
                            .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_blogs.b_admin_id')
                            .where('ed_blogs.b_is_deleted', false)
                            .orderBy('ed_blogs.b_id', 'DESC');

    return res.status(200).send({
      message: 'Blog list have been fetched',
      data: result
    })

  } catch (err) {
    return res.status(422).send(
      unExpectedError(
        'Blog list could not be fetched',
        'Blog list could not be fetched',
        'blogs'
      )
    )
  }
}

module.exports.createBlog = async (req, res) => {

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
    const {title, tags, description, is_active} = req.body;

    let slug = convertIntoSlug(title);

    let obj = {
      b_title: title,
      b_slug: slug,
      b_description: description,
      b_admin_id: loggedin_user,
      b_is_active: is_active
    }

    let blog = await trx('ed_blogs').insert(obj).returning('*');

    let blog_id = blog[0].b_id;

    let tags_arr = [];
    for (let y of tags) {
      tags_arr.push({
        b_c_blog_id: blog_id,
        b_c_category_id: y
      })
    }

    let blog_cat_result = await trx('ed_blogs_categories').insert(tags_arr).returning('*');
    trx.commit();
    return res.status(200).send({
      message: 'Blog is saved successfully',
      data: ''
    })

  } catch (err) {
    trx.rollback();
    return res.status(422).send(
      unExpectedError(
        'Blog could not be saved, please try again',
        'Blog could not be saved, please try again',
        'error'
      )
    )
  }
}

module.exports.getBlogBySlug = async (req, res) => {
  try {
    let {blog_slug} = req.params;
    let blog = await knex('ed_blogs').where('b_slug', blog_slug).first();

    let tags_ids = await knex('ed_blogs_categories').select('b_c_category_id as id').where('b_c_blog_id', blog.b_id).returning('*');

    let ids = [];
    for (let y of tags_ids) {
      ids.push(y.id)
    }

    let tags = await knex('ed_blog_categories').whereIn('c_id', ids).returning('*');

    let tags_arr = [];
    for (let y of tags) {
      tags_arr.push({
        value: y.c_id,
        label: y.c_name
      })
    }

    if (blog) {

      let object = {
        id: blog.b_id,
        title: blog.b_title,
        blog_slug: blog.b_slug,
        description: blog.b_description,
        tags: tags_arr,

        is_active: blog.b_is_active,
      }

      return res.status(200).send({
        message: 'Blog by slug has been fetched',
        data: object
      })
    } else {
      return res.status(404).send(unExpectedError(
        'Blog could not be found',
        'Blog could not be found',
        'blog'
      ))
    }
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to fetch Blog by slug again',
      'Something went wrong, please try to fetch Blog by slug again',
      'subject'
    ))
  }
}

module.exports.editBlog = async (req, res) => {

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
    let blog_id = req.params.blog_id;
    const {title, tags, description, is_active} = req.body;

    let slug = convertIntoSlug(title);

    let obj = {
      b_title: title,
      b_slug: slug,
      b_description: description,
      b_admin_id: loggedin_user,
      b_is_active: is_active
    }

    let blog = await trx('ed_blogs').where('b_id', blog_id).update(obj).returning('*');

    let tags_arr = [];
    for (let y of tags) {
      tags_arr.push({
        b_c_blog_id: blog_id,
        b_c_category_id: y
      })
    }

    let tags_delete = await trx('ed_blogs_categories').where('b_c_blog_id', blog_id).del().returning('*');
    let tags_result = await trx('ed_blogs_categories').insert(tags_arr).returning('*');

    trx.commit();
    return res.status(200).send({
      message: 'Blog is updated successfully',
      data: {
        slug: blog[0].b_slug
      }
    })

  } catch (err) {
    trx.rollback();
    return res.status(422).send(
      unExpectedError(
        'Blog could not be updated, please try again',
        'Blog could not be updated, please try again',
        'blog'
      )
    )
  }
}

module.exports.deleteBlog = async (req, res) => {
  try {
    const { blog_id } = req.params;
    let result = await knex('ed_blogs').update({b_is_deleted: true}).where('b_id', blog_id);
    if (result) {
      return res.status(200).send({
        message: 'Blog has been deleted successfully',
        data: result
      })
    }

    return res.status(404).send(unExpectedError(
      'Blog does not exist',
      'Blog does not exist',
      'Blog'
    ))
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}
