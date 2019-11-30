const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Patente = require("../models/Patente");
const Alerta = require("../models/Alerta");
const Datosusuario = require("../models/Datosusuario");
// METODOS DE ENCRIPTACION
const bcrypt = require("bcrypt");
const salt = 12;
const cryptPassword = password => {
    return bcrypt.hashSync(password, salt);
};

router.get("/estadisticas/:institucion_id", async (req, res) => {
    let { institucion_id } = req.params;
    let userCount = await Usuario.query().count("id as a").where({ institucion_id });
    let patenteCount = await Patente.query().count("id as p").where({ institucion_id });
    let alertaCount = await Alerta.query().count("id as al").where({ institucion_id });
    return res.send({
        response: true,
        data: {
            user_count: userCount[0].a,
            patente_count: patenteCount[0].p,
            alerta_count: alertaCount[0].al
        }
    });
});

/**
 * GUARDIAS
 */
router.get("/guardias/:institucion_id", async (req, res) => {
    let { institucion_id } = req.params;
    let guardias = await Usuario.query().select("usuario.id", "usuario.user", "usuario.institucion_id", "usuario.blocked", "usuario.disponible", "institucion.institucion", "datos_usuario.nombre", "datos_usuario.correo", "datos_usuario.fono").leftJoin(
        "institucion",
        "usuario.institucion_id",
        "=",
        "institucion.id"
    ).leftJoin(
        "datos_usuario",
        "usuario.id",
        "=",
        "datos_usuario.usuario_id"
    ).where({
        tipo_usuario_id: 3,
        institucion_id
    }).orderBy("id", "asc");
    return res.send({
        response: true,
        data: guardias
    });
});
router.post("/guardias/crear/:institucion_id", async (req, res) => {
    let { user, password } = req.body;
    let { institucion_id } = req.params;

    if (institucion_id == 1) return res.send({ response: false, message: "Un guardia tiene que ser de una institución" });

    let guardia = await Usuario.query().where("user", user);
    if (guardia.length != 0) return res.send({ response: false, message: "ya está registrado" });
    await Usuario.query().insert({
        user,
        password: cryptPassword(password),
        institucion_id,
        tipo_usuario_id: 3
    });
    return res.send({
        response: true
    });
});
router.post("/guardias/editar/:guardia_id", async (req, res) => {
    let { user, password, nombre, fono, correo, blocked, disponible, institucion_id } = req.body;
    let { guardia_id } = req.params;

    let guardia = await Usuario.query().where("id", guardia_id);
    if (guardia.length == 0) return res.send({ response: false, message: "no existe este usuario" });
    await Usuario.query().patch({
        user,
        blocked,
        disponible,
        institucion_id,
    }).where("id", guardia_id);
    if (password != null && password != '') await Usuario.query().patch({ password: cryptPassword(password) }).where("id", guardia_id);
    await Datosusuario.query().patch({ nombre, fono, correo }).where("usuario_id", guardia_id);
    return res.send({
        response: true
    });
});
router.post("/guardias/habilitar/:guardia_id", async (req, res) => {
    let { guardia_id } = req.params;
    await Usuario.query().patch({
        guardia_habilitado: true
    }).where("id", guardia_id);
    return res.send({
        response: true
    });
});
router.post("/guardias/deshabilitar/:guardia_id", async (req, res) => {
    let { guardia_id } = req.params;
    await Usuario.query().patch({
        guardia_habilitado: false
    }).where("id", guardia_id);
    return res.send({
        response: true
    });
});


module.exports = router;
