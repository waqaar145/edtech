const Router = require('express');
const routes = new Router();

const subjectController = require('./subject.controllers');
const subjectValidation = require('./subject.validations');
const { isLoggedIn } = require('./../../../helpers/auth');
const { fileUpload } = require('./../../../helpers/multiple_file_upload');
const fileUploadNow = fileUpload.single('thumbnail');

routes.post('/subjects', [isLoggedIn], subjectController.createSubject);
routes.get('/subjects', [isLoggedIn], subjectController.getSubjects);
routes.get('/subjects/:subject_slug', [isLoggedIn, subjectValidation.slugValidation], subjectController.getSubjectBySlug);
routes.put('/subjects/:subject_id', [isLoggedIn], subjectController.updateSubjectBySlug);
routes.delete('/subjects/:subject_id', [isLoggedIn,  subjectValidation.idValidation], subjectController.deleteSubjectById);
routes.get('/subjects/semester/:semester_id', [isLoggedIn,  subjectValidation.semesterIdValidation], subjectController.getAllSubjectsBySemesterId);

module.exports = routes;
