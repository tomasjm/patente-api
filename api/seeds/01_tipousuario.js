exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("tipo_usuario")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tipo_usuario").insert([
        { id: 1, tipo: "ADMIN_TYPE" },
        { id: 2, tipo: "ADMININSTITUCION_TYPE" },
        { id: 3, tipo: "GUARDIA_TYPE" },
        { id: 4, tipo: "USUARIO_TYPE" }
      ]);
    });
};
