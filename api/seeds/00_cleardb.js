exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("patente")
    .del()
    .then(function() {
      return knex("datos_usuario")
        .del()
        .then(function() {
          return knex("usuario")
            .del()
            .then(function() {
              return knex("tipo_usuario")
                .del()
                .then(function() {
                  console.log("base de datos limpiada");
                });
            });
        });
    });
};
