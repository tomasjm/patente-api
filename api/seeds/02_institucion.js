exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("institucion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("institucion").insert([
        {
          id: 1,
          institucion: "Universidad de la Frontera",
        },
        {
          id: 2,
          institucion: "Universidad Autonoma",
        },
        {
          id: 3,
          institucion: "Universidad Mayor",
        }
      ]);
    });
};
