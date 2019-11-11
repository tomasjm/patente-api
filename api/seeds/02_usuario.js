const bcrypt = require("bcrypt");
const salt = 12;
const cryptPassword = password => {
  return bcrypt.hashSync(password, salt);
};

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  /**
   * Tipo usuario id
   * 1: Admin
   * 2: Guardia
   * 3: Usuario
   * 
   */
  return knex("usuario")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("usuario").insert([
        {
          id: 1,
          user: "admin",
          password: cryptPassword("password"),
          token: null,
          tipo_usuario_id: 1
        },
        {
          id: 2,
          user: "guardia",
          password: cryptPassword("password"),
          token: null,
          tipo_usuario_id: 2
        },
        {
          id: 3,
          user: "usuario",
          password: cryptPassword("password"),
          token: null,
          tipo_usuario_id: 3
        }
      ]);
    });
};
