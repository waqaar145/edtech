const knex = require('./../../../db/knex');

module.exports.test = (req, res) => {
  return res.status(200).send('okay user test');
}
