const { Model } = require("objection");

class Tipousuario extends Model {
  static get tableName() {
    return "tipo_usuario";
  }
}

module.exports = Tipousuario;
