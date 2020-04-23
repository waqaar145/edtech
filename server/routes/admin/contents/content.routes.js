const Router = require('express');
const routes = new Router();

const contentController = require('./content.controllers');
const contentValidation = require('./content.validations');
const { isLoggedIn } = require('./../../../helpers/auth');

routes.get('/contents/get_years', [isLoggedIn], contentController.getYears);
routes.get('/contents', [isLoggedIn], contentController.getContents);
routes.post('/contents', [isLoggedIn, contentValidation.create], contentController.createContent);
routes.get('/contents/:content_slug', [isLoggedIn, contentValidation.getBySlug], contentController.getContentBySlug);
routes.put('/contents/:content_id', [isLoggedIn, contentValidation.edit], contentController.editContent);
routes.delete('/contents/:content_id', [isLoggedIn, contentValidation.delete], contentController.deleteContent);

module.exports = routes;
