const knex = require('./../../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../../messages/error');
const bcrypt = require('bcryptjs');
const { fileUpload } = require('./../../../../helpers/multiple_file_upload');
const fileUploadNow = fileUpload.single('thumbnail');
const config = require('./../../../../config/config')
const { convertIntoSlug } = require('./../../../../helpers/slug')

module.exports.getBlogCategories = async (req, res, next) => {
  try {
    let result = await knex.select(
                            'ed_blog_categories.c_id as id',
                            'ed_blog_categories.c_name as name',
                            'ed_blog_categories.c_slug as slug',
                            'ed_blog_categories.c_thumbnail as thumbnail',
                            'ed_blog_categories.c_is_active as is_active',
                            'ed_admins.a_id as admin_id',
                            'ed_admins.a_email as admin_email',
                            'ed_admins.a_name as admin_name'
                          ).from('ed_blog_categories')
                          .innerJoin('ed_admins', 'ed_admins.a_id', 'ed_blog_categories.c_admin_id')
                          .where('ed_blog_categories.c_is_deleted', false)
                          .orderBy('ed_blog_categories.c_id', 'ASC')

    return res.status(200).send({
      message: 'Blog categories list has been fetched',
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

module.exports.createBlogCategory = async (req, res, next) => {
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
      await check('category_name').isLength({ min: 3, max: 50}).withMessage('Category name must be at least 3 or maximum 50 characters long').trim().escape().run(req);
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
      const { category_name, is_active} = req.body;
      let slug = convertIntoSlug(category_name); // slug for semester
      let loggedin_user = req.user.uid;

      let check_slug = await knex('ed_blog_categories').where('c_slug', slug).first();
      if (check_slug) {
        return res.status(422).send(unExpectedError(
          'This category name already exists.',
          'This category name already exists.',
          'semester'
        ))
      }

      let category_obj = { // object to be inserted into database
        c_name: category_name,
        c_slug: slug,
        c_thumbnail: image_path,
        c_admin_id: loggedin_user,
        c_is_active: is_active
      }

      let result = await knex('ed_blog_categories').insert(category_obj).returning('*');
      if (result) {
        let object = {
          category_name: result[0].c_name,
          slug: result[0].c_slug,
          thumbnail: result[0].c_thumbnail,
          is_active: result[0].c_is_active,
        }

        return res.status(200).send({
          message: 'Blog cateogry details is saved successfully',
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

module.exports.getBlogCategoryBySlug = async (req, res, next) => {
  try {
    let category_slug = req.params.category_slug;
    let category = await knex('ed_blog_categories').where('c_slug', category_slug).first();
    if (category) {
      let object = {
        category_id: category.c_id,
        category_name: category.c_name,
        slug: category.c_slug,
        thumbnail: category.c_thumbnail,
        is_active: category.c_is_active,
      }

      return res.status(200).send({
        message: 'B by slug has been fetched',
        data: object
      })
    } else {
      return res.status(404).send(unExpectedError(
        'Blog category could not be found',
        'Blog category could not be found',
        'category'
      ))
    }
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to fetch blog category by slug again',
      'Something went wrong, please try to fetch blog category by slug again',
      'semester'
    ))
  }
}

module.exports.updateBlogCategyBySlug = async (req, res, next) => {
  fileUploadNow(req, res, async function (err) {
    if (err) {
      return res.status(422).send(unExpectedError(
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'Please select a thumbnail & only .png, .jpg and .jpeg format allowed!',
        'image'
      ))
    }

    try {
      await check('category_id').isInt().withMessage('Id should be a number').run(req);
      await check('category_name').isLength({ min: 3, max: 50}).withMessage('Category name must be at least 3 or maximum 50 characters long').trim().escape().run(req);
      await check('is_active').isBoolean().withMessage('Is active should be either true or false').run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({
          message: 'Got error while submitting',
          data: errors.array()
        });
      }

      let loggedin_user = req.user.uid;
      const { category_name, is_active } = req.body;
      const { category_id } = req.params;
      let slug = convertIntoSlug(category_name); // slug for semester

      let check_slug = await knex('ed_blog_categories').where('c_slug', slug).first();
      if (check_slug && check_slug.c_admin_id !== loggedin_user) {
        return res.status(422).send(unExpectedError(
          'This blog category name already exists.',
          'This blog category name already exists.',
          'category'
        ))
      }

      let data = {};
      if (!req.file) {
        data = {
          c_name: category_name,
          c_slug: slug,
          c_is_active: is_active
        }
      } else {
        let image_path = config.SERVER_URL + '/' + req.file.filename;
        data = {
          c_name: category_name,
          c_slug: slug,
          c_thumbnail: image_path,
          c_is_active: is_active
        }
      }

      let result = await knex('ed_blog_categories').update(data).where('c_id', category_id).returning('*');
      if (result) {
        let object = {
          category_id: result[0].c_id,
          category_name: result[0].c_name,
          slug: result[0].c_slug,
          thumbnail: result[0].c_thumbnail,
          is_active: result[0].c_is_active,
        }

        return res.status(200).send({
          message: 'Blog category details is updated successfully',
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

module.exports.deleteBlogCategoryById = async (req, res) => {
  try {
    const { category_id } = req.params;
    let result = await knex('ed_blog_categories').update({c_is_deleted: true}).where('c_id', category_id);
    if (result) {
      return res.status(200).send({
        message: 'Blog category has been deleted successfully',
        data: result
      })
    }

    return res.status(404).send(unExpectedError(
      'Blog category does not exists',
      'Blog category does not exists',
      'category'
    ))
  } catch (err) {
    return res.status(422).send(unExpectedError(
      'Something went wrong, please try to delete again',
      'Something went wrong, please try to delete again',
      'semester'
    ))
  }
}
