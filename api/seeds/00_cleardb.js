exports.seed = async function (knex, Promise) {
  // Deletes ALL existing entries

  await knex("patente").del();
  await knex("datos_usuario").del();
  await knex("institucion").del();
  await knex("tipo_usuario").del();
  return console.log("base de datos limpiada");
  // return knex("patente")
  //   .del()
  //   .then(function() {
  //     return knex("datos_usuario")
  //       .del()
  //       .then(function() {
  //         return knex("usuario")
  //           .del()
  //           .then(function() {
  //             return knex("tipo_usuario")
  //               .del()
  //               .then(function() {
  //                 console.log("base de datos limpiada");
  //               });
  //           });
  //       });
  //   });
};
