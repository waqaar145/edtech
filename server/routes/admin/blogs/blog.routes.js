const Router = require('express');
const routes = new Router();

const blogController = require('./blog.controllers');
const blogValidation = require('./blog.validations');
const { isLoggedIn } = require('./../../../helpers/auth');

routes.get('/blogs', [isLoggedIn], blogController.getBlogs);
routes.post('/blogs', [isLoggedIn, blogValidation.create], blogController.createBlog);
routes.get('/blogs/:blog_slug', [isLoggedIn, blogValidation.getBySlug], blogController.getBlogBySlug);
routes.put('/blogs/:blog_id', [isLoggedIn, blogValidation.edit], blogController.editBlog);
routes.delete('/blogs/:blog_id', [isLoggedIn, blogValidation.delete], blogController.deleteBlog);

module.exports = routes;
