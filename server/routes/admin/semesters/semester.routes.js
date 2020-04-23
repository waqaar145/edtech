const Router = require('express');
const routes = new Router();

const semesterController = require('./semester.controllers');
const semesterValidation = require('./semester.validations');
const { isLoggedIn } = require('./../../../helpers/auth');
const { fileUpload } = require('./../../../helpers/multiple_file_upload');
const fileUploadNow = fileUpload.single('thumbnail');

routes.post('/semesters', [isLoggedIn], semesterController.createSemester);
routes.get('/semesters', [isLoggedIn], semesterController.getSemesters);
routes.get('/semesters/:semester_slug', [isLoggedIn, semesterValidation.slugValidation], semesterController.getSemesterBySlug);
routes.put('/semesters/:semester_id', [isLoggedIn], semesterController.updateSemesterBySlug);
routes.delete('/semesters/:semester_id', [isLoggedIn,  semesterValidation.idValidation], semesterController.deleteSemesterById);

module.exports = routes;
