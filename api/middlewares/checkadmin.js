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
            req.userid = payload.id;
            console.log(req.institucion_id);
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
