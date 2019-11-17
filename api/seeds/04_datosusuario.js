exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("datos_usuario")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("datos_usuario").insert([
        {
          id: 1,
          nombre: "",
          anexo: "",
          fono: "",
          correo: "",
          usuario_id: 1
        },
        {
          id: 2,
          nombre: "",
          anexo: "",
          fono: "",
          correo: "",
          usuario_id: 2
        },
        {
          id: 3,
          nombre: "",
          anexo: "",
          fono: "",
          correo: "",
          usuario_id: 3
        }
      ]);
    });
};
