const { Model } = require("objection");

class Alerta extends Model {
    static get tableName() {
        return "alerta";
    }
}

module.exports = Alerta;
