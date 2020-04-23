const Router = require('express');
const routes = new Router();

const {signUp, signIn, loggedIn, logOut} = require('./user.controllers');
const { signupValidation, signinValidation } = require('./user.validations');
const { isLoggedIn } = require('./../../../helpers/auth');

routes.post('/auth/signup', [signupValidation], signUp);
routes.post('/auth/signin', [signinValidation], signIn);
routes.get('/auth/logged-in', isLoggedIn, loggedIn);
routes.get('/auth/logout', isLoggedIn, logOut);

module.exports = routes;
