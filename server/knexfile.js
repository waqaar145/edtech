module.exports = {
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "qwertii123",
    database: "testDB",
  },
  migrations: {
    directory: __dirname + "/db/migrations",
  },
  seeds: {
    directory: __dirname + "/db/seeds",
  },
};
