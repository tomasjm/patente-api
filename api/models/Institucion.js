const { Model } = require("objection");

class Institucion extends Model {
    static get tableName() {
        return "institucion";
    }
}

module.exports = Institucion;
