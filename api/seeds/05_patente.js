exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("patente")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("patente").insert([
        { id: 1, patente: "AABB12", desc: "descripcion", usuario_id: 3 }
      ]);
    });
};
