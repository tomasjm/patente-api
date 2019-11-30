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
          firebase_token: null,
          tipo_usuario_id: 1,
          institucion_id: 1
        },
        {
          id: 2,
          user: "subadmin",
          password: cryptPassword("password"),
          token: null,
          firebase_token: null,
          tipo_usuario_id: 2,
          institucion_id: 2
        },
        {
          id: 3,
          user: "guardia",
          password: cryptPassword("password"),
          guardia_habilitado: true,
          token: null,
          firebase_token: null,
          tipo_usuario_id: 3,
          institucion_id: 2
        },
        {
          id: 4,
          user: "usuario",
          password: cryptPassword("password"),
          token: null,
          firebase_token: 'e1RT3FLNa6Q:APA91bGH7RA-I_O_psUf5Ggno2FVEv0Z2-kaRrPr6h6YABHcKhi1c0aUwRESdRdgLymk-boaSrygjlMs4eroEkp4IVvogCd7FKiCF5kFPcnTxtt9-stCZ6PU1MkGbyq4xcj7O_yy0v83',
          tipo_usuario_id: 4,
          institucion_id: 1
        }
      ]);
    });
};
