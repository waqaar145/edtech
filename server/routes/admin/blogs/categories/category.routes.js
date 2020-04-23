const Router = require('express');
const routes = new Router();

const categoryController = require('./category.controllers');
const categoryValidation = require('./category.validations');
const { isLoggedIn } = require('./../../../../helpers/auth');
const { fileUpload } = require('./../../../../helpers/multiple_file_upload');
const fileUploadNow = fileUpload.single('thumbnail');

routes.post('/blog/categories', [isLoggedIn], categoryController.createBlogCategory);
routes.get('/blog/categories', [isLoggedIn], categoryController.getBlogCategories);
routes.get('/blog/categories/:category_slug', [isLoggedIn, categoryValidation.slugValidation], categoryController.getBlogCategoryBySlug);
routes.put('/blog/categories/:category_id', [isLoggedIn], categoryController.updateBlogCategyBySlug);
routes.delete('/blog/categories/:category_id', [isLoggedIn,  categoryValidation.idValidation], categoryController.deleteBlogCategoryById);

module.exports = routes;
