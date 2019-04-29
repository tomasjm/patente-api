const { Model } = require("objection");

class Usuario extends Model {
  static get tableName() {
    return "usuario";
  }
}

module.exports = Usuario;
