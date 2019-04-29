/*
    ARCHIVO: knexfile.js
    DESCRIPCION: Sirve para usar Knex CLI en el proyecto, nos permite hacer migraciones, seed, etc.
*/
module.exports = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "patentedb"
  }
};
