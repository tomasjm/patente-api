const { Model } = require("objection");

class Patente extends Model {
  static get tableName() {
    return "patente";
  }
}

module.exports = Patente;
