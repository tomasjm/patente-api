const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config.json");

const checksession = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({
            response: false,
            error: "No tienes autorización"
        });
    }
    const token = req.headers.authorization;
    jwt.verify(token, config.JWTKEY, (err, payload) => {
        if (payload) {
            if (payload.tipo_usuario_id < 2) return res.send({ response: false, message: "No tienes permisos de administrador " });
            req.userid = payload.id;
            req.institucion_id = payload.institucion_id;
            next();
        }
        if (err) {
            res.send({
                response: false,
                error: "El token es invalido!"
            });
        }
    });
};

module.exports = checksession;
