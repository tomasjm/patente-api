exports.up = async (knex, Promise) => {
  await knex.schema
    .createTable("tipo_usuario", function (table) {
      table.increments("id").primary();
      table.string("tipo", 45);
    });
  await knex.schema
    .createTable("institucion", function (table) {
      table.increments("id").primary();
      table.string("institucion", 60);
    });
  await knex.schema
    .createTable("usuario", function (table) {
      table.increments("id").primary();
      table.string("user", 60);
      table.string("password");
      table.string("token").defaultTo('');
      table.string("firebase_token").defaultTo('');
      table.boolean("blocked").defaultTo(false);
      table.boolean("disponible").defaultTo(true);
      table
        .integer("institucion_id")
        .unsigned()
        .notNullable();
      table
        .foreign("institucion_id")
        .references("id")
        .inTable("institucion");
      table
        .integer("tipo_usuario_id")
        .unsigned()
        .notNullable();
      table
        .foreign("tipo_usuario_id")
        .references("id")
        .inTable("tipo_usuario");
    });
  await knex.schema
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
    });
  await knex.schema.createTable("alerta", function (table) {
    table.increments("id").primary();
    table.string("tipo");
    table.boolean("confirmado").defaultTo(false);
    table.integer("fecha");
    table.string("uuid", 60);
    table.boolean("enviado").defaultTo(false);
    table
      .integer("desde_usuario_id")
      .unsigned()
      .notNullable();
    table
      .foreign("desde_usuario_id")
      .references("id")
      .inTable("usuario");
    table
      .integer("patente_id")
      .unsigned()
      .notNullable();
    table
      .foreign("patente_id")
      .references("id")
      .inTable("patente");
    table
      .integer("hacia_usuario_id")
      .unsigned()
      .notNullable();
    table
      .foreign("hacia_usuario_id")
      .references("id")
      .inTable("usuario");
  });
  await knex.schema
    .createTable("datos_usuario", function (table) {
      table.increments("id").primary();
      table.string("nombre", 60);
      table.string("anexo", 20);
      table.string("correo", 60);
      table.string("fono", 20);
      table
        .integer("usuario_id")
        .unsigned()
        .notNullable();
      table
        .foreign("usuario_id")
        .references("id")
        .inTable("usuario");
    });



  return console.log("BASE DE DATOS CREADA EXITOSAMENTE");


  // return knex.schema
  //   .createTable("tipo_usuario", function (table) {
  //     table.increments("id").primary();
  //     table.string("tipo", 45);
  //   })
  //   .then(() => {
  //     return knex.schema
  //       .createTable("usuario", function (table) {
  //         table.increments("id").primary();
  //         table.string("user", 120);
  //         table.string("password");
  //         table.string("token");
  //         table.string("firebase_token");
  //         table
  //           .integer("institucion_id")
  //           .unsigned()
  //           .notNullable();
  //         table
  //           .foreign("institucion_id")
  //           .references("id")
  //           .inTable("institucion");
  //         table
  //           .integer("tipo_usuario_id")
  //           .unsigned()
  //           .notNullable();
  //         table
  //           .foreign("tipo_usuario_id")
  //           .references("id")
  //           .inTable("tipo_usuario");
  //       })
  //       .then(() => {
  //         return knex.schema
  //           .createTable("datos_usuario", function (table) {
  //             table.increments("id").primary();
  //             table.string("nombre", 120);
  //             table.string("anexo", 20);
  //             table.string("correo", 120);
  //             table.string("fono", 20);
  //             table
  //               .integer("usuario_id")
  //               .unsigned()
  //               .notNullable();
  //             table
  //               .foreign("usuario_id")
  //               .references("id")
  //               .inTable("usuario");
  //           })
  //           .then(() => {
  //             return knex.schema
  //               .createTable("patente", function (table) {
  //                 table.increments("id").primary();
  //                 table.string("patente", 10);
  //                 table.string("desc", 250);
  //                 table
  //                   .integer("usuario_id")
  //                   .unsigned()
  //                   .notNullable();
  //                 table
  //                   .foreign("usuario_id")
  //                   .references("id")
  //                   .inTable("usuario");
  //               })
  //               .then(() => {
  //                 console.log("BASE DE DATOS CREADA EXITOSAMENTE");
  //               });
  //           });
  //       });
  //   });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("datos_usuario").then(() => {
    return knex.schema.dropTable("patente").then(() => {
      return knex.schema.dropTable("usuario").then(() => {
        return knex.schema.dropTable("tipo_usuario").then(() => {
          return knex.schema.dropTable("institucion").then(() => {
            return knex.schema.dropTable("alerta").then(() => {

            });
          });
        });
      });
    });
  });
};
