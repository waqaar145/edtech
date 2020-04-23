var userRoutes = require('./users/auth/user.routes.js');

module.exports.routes = (app) => {
  app.use('/api/v1', userRoutes)
}
