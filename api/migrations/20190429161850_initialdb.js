exports.up = function (knex, Promise) {
  return knex.schema
    .createTable("tipo_usuario", function (table) {
      table.increments("id").primary();
      table.string("tipo", 45);
    })
    .then(() => {
      return knex.schema
        .createTable("usuario", function (table) {
          table.increments("id").primary();
          table.string("user", 120);
          table.string("password");
          table.string("token");
          table.string("firebase_token");
          table
            .integer("tipo_usuario_id")
            .unsigned()
            .notNullable();
          table
            .foreign("tipo_usuario_id")
            .references("id")
            .inTable("tipo_usuario");
        })
        .then(() => {
          return knex.schema
            .createTable("datos_usuario", function (table) {
              table.increments("id").primary();
              table.string("nombre", 120);
              table.string("anexo", 20);
              table.string("correo", 120);
              table.string("fono", 20);
              table
                .integer("usuario_id")
                .unsigned()
                .notNullable();
              table
                .foreign("usuario_id")
                .references("id")
                .inTable("usuario");
            })
            .then(() => {
              return knex.schema
                .createTable("patente", function (table) {
                  table.increments("id").primary();
                  table.string("patente", 10);
                  table.string("desc", 250);
                  table
                    .integer("usuario_id")
                    .unsigned()
                    .notNullable();
                  table
                    .foreign("usuario_id")
                    .references("id")
                    .inTable("usuario");
                })
                .then(() => {
                  console.log("BASE DE DATOS CREADA EXITOSAMENTE");
                });
            });
        });
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("datos_usuario").then(() => {
    return knex.schema.dropTable("patente").then(() => {
      return knex.schema.dropTable("usuario").then(() => {
        return knex.schema.dropTable("tipo_usuario").then(() => { });
      });
    });
  });
};
