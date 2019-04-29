const bcrypt = require("bcrypt");
const salt = 12;
const cryptPassword = password => {
  return bcrypt.hashSync(password, salt);
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("usuario")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("usuario").insert([
        {
          id: 1,
          user: "tomjx",
          password: cryptPassword("password"),
          token: null,
          tipo_usuario_id: 1
        }
      ]);
    });
};
