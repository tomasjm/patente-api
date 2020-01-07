const { Model } = require("objection");

class Validacion extends Model {
    static get tableName() {
        return "validacion";
    }
}

module.exports = Validacion;
