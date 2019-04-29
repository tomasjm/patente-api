exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("datos_usuario")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("datos_usuario").insert([
        {
          id: 1,
          nombre: "Tomás Jiménez",
          anexo: "anexo",
          fono: "82171584",
          correo: "tjimenez999@gmail.com",
          usuario_id: 1
        }
      ]);
    });
};
