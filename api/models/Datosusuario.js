const { Model } = require("objection");

class Datosusuario extends Model {
  static get tableName() {
    return "datos_usuario";
  }
}

module.exports = Datosusuario;
