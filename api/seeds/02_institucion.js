exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("institucion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("institucion").insert([
        {
          id: 1,
          institucion: "Sin institución",
        },
        {
          id: 2,
          institucion: "Universidad de la Frontera",
        },
        {
          id: 3,
          institucion: "Universidad Autonoma",
        },
        {
          id: 4,
          institucion: "Universidad Mayor",
        }
      ]);
    });
};
