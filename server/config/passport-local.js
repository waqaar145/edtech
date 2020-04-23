const passport = require('passport');
const knex = require('./../db/knex.js');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(async function(user, done) {
  let user1 = await knex('ed_admins').where('a_id', user.uid).first();
  if (!user1) {
    done(null, false)
  }
  let obj = {
    uid: user.uid,
    uuid: user.uuid,
    user_name: user.user_name,
    user_email: user.user_email,
    user_slug: user.user_slug
  }
  done(null, obj)
});
