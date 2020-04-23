const Router = require('express');
const routes = new Router();

const chapterController = require('./chapter.controllers');
const chapterValidation = require('./chapter.validations');
const { isLoggedIn } = require('./../../../helpers/auth');

routes.post('/chapters', [isLoggedIn, chapterValidation.create], chapterController.createChapter);
routes.get('/chapters', [isLoggedIn], chapterController.getChapters);
routes.get('/chapters/:chapter_slug', [isLoggedIn, chapterValidation.getBySlug], chapterController.getChapterBySlug);
routes.put('/chapters/:chapter_id', [isLoggedIn, chapterValidation.update], chapterController.updateChapterById);
routes.delete('/chapters/:chapter_id', [isLoggedIn, chapterValidation.delete], chapterController.deleteChapterById);
routes.get('/chapters/subject/:subject_id', [isLoggedIn, chapterValidation.id], chapterController.getChaptersBySubjectId);

module.exports = routes;
