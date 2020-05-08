var authRoutes = require('./admin/auth/user.routes.js');
var semesterRoutes = require('./admin/semesters/semester.routes.js');
var subjectRoutes = require('./admin/subjects/subject.routes.js');
var chapterRoutes = require('./admin/chapters/chapter.routes.js');
var contentRoutes = require('./admin/contents/content.routes.js');

var blogCategoriesRoutes = require('./admin/blogs/categories/category.routes.js');
var blogRoutes = require('./admin/blogs/blog.routes.js');

module.exports.routes = (app) => {
  app.use('/api/v1/admin', authRoutes),
  app.use('/api/v1/admin', semesterRoutes),
  app.use('/api/v1/admin', subjectRoutes),
  app.use('/api/v1/admin', chapterRoutes),
  app.use('/api/v1/admin', contentRoutes),
  app.use('/api/v1/admin', blogCategoriesRoutes),
  app.use('/api/v1/admin', blogRoutes)
}
