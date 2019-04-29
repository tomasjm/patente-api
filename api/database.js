var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "patentedb"
  }
});
module.exports = knex;
