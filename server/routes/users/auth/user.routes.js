const Router = require('express');
const routes = new Router();

const userControllers = require('./user.controllers');

routes.get('/auth/user', userControllers.test);


module.exports = routes;
