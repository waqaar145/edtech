const knex = require('./../../../db/knex');
const { check, validationResult } = require('express-validator');
const {unExpectedError} = require('./../../../messages/error');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const signUp = async (req, res) => {
  // Validation *******
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({
      message: 'Got error while submitting',
      data: errors.array()
    });
  }
  // Validation *******

  const {name, email, password} = req.body;
  let email_exists = await knex('ed_admins').where('a_email', email).returning(['a_email', 'a_id']).first();
  if (email_exists) {
    return res.status(422).send(
      unExpectedError(
        'Can\'t signup',
        'This email already exists',
        'email'
      )
    );
  }

  bcrypt.hash(password, 8, async function(err, hash){
     if (err) return res.status(500).send({message: 'something went wrong'})
     let slug = slugify(name, {
                          replacement: '-',
                          remove: /[*+~.(][)'"!:@, .:;`~!@#$%^&{}]/g,
                          lower: true
                        });

     let count = await knex('ed_admins').where('a_slug', 'like', `%${slug}%`).count('').first();
     count = parseInt(count.count);
     if (count > 0) {
       slug = slug + '-' + ( count + 1 );
     }

     knex('ed_admins')
       .insert({a_name: name, a_slug: slug, a_email: email, a_password: hash})
       .returning(['a_id', 'a_uuid', 'a_name', 'a_slug', 'a_email'])
       .then(function(user) {
         let user_obj = user[0];
         let obj = {
           uid: user_obj.a_id,
           uuid: user_obj.a_uuid,
           user_name: user_obj.a_name,
           user_email: user_obj.a_email,
           user_slug: user_obj.a_slug
         }
         req.logIn(obj, function (err) {
           return res.status(200).send(obj);
         });
       })
       .catch(error => {
          console.log(error)
          return res.status(422).send(
            unExpectedError(
              'Can\'t signup',
              'User can not be signed up, please try again later.',
              'email'
            )
          );
       })
     })

}

const signIn = async (req, res, next) => {

  console.log(req.body)
  // Validation *******
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Got error while signining',
      data: errors.array()
    });
  }
  // Validation *******
  try {
    const { email, password } = req.body;
    let user_obj = await knex('ed_admins').where('a_email', email).first();
    if (!user_obj) {
      return res.status(422).send(
        unExpectedError(
          'Can\'t signin',
          'This email does not exists',
          'email'
        )
      );
    }
    bcrypt.compare(password, user_obj.a_password, function(err, result){
         if(err) {
           return res.status(401).send(
             unExpectedError(
               'Unauthorized access',
               'Unauthorized access',
               'email'
           ));
         }
         if (result) {
           let obj = {
             uid: user_obj.a_id,
             uuid: user_obj.a_uuid,
             user_name: user_obj.a_name,
             user_email: user_obj.a_email,
             user_slug: user_obj.a_slug
           }
           req.logIn(obj, function (err) {
             res.status(200).send(obj);
           });
         } else {
           return res.status(422).send(
             unExpectedError(
               'Can\'t signin',
               'Password did not match',
               'password'
             )
           )
         }
      });
  } catch (err) {
    res.status(422).send(
      unExpectedError(
       'Can\'t signin',
       'Something went while signin',
       'password'
     ));
  }
}

const loggedIn = async (req, res) => {
  if (req.user) {
    return res.status(200).send(req.user)
  }
  return res.status(401)
            .send({
              uid: '',
              uuid: '',
              name: '',
              email: '',
              slug: ''
            });
}

const logOut = async (req, res, next) => {
  req.session.destroy(function (err) {
    return res.status(200)
              .send({
                uid: '',
                uuid: '',
                name: '',
                email: '',
                slug: ''
              });
  });
}

module.exports = { signUp, signIn, loggedIn, logOut }
