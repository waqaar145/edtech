module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'school'
  },
  migrations: {
    directory: __dirname + '/db/migrations',
  },
  seeds: {
    directory: __dirname + '/db/seeds',
  },
}
