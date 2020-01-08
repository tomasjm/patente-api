const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Alerta = require("../models/Alerta");
const Datosusuario = require("../models/Datosusuario");
// METODOS DE ENCRIPTACION
const bcrypt = require("bcrypt");
const salt = 12;
const cryptPassword = password => {
    return bcrypt.hashSync(password, salt);
};

router.get("/estadisticas", async (req, res) => {
    let institucion_id = req.institucion_id;
    let userCount = await Usuario.query().count("id as a").where({ institucion_id, tipo_usuario_id: 3 });
    return res.send({
        response: true,
        data: {
            user_count: userCount[0].a,
        }
    });
});

/**
 * GUARDIAS
 */
router.get("/guardias", async (req, res) => {
    let institucion_id = req.institucion_id;
    let guardias = await Usuario.query().select("usuario.id", "usuario.usuario", "usuario.institucion_id", "usuario.guardia_habilitado", "usuario.bloqueado", "institucion.institucion", "datos_usuario.nombre", "datos_usuario.correo", "datos_usuario.fono").leftJoin(
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
router.post("/guardias/crear", async (req, res) => {
    let { usuario, password } = req.body;
    let institucion_id = req.institucion_id;

    if (institucion_id == 1) return res.send({ response: false, message: "Un guardia tiene que ser de una institución" });

    let guardia = await Usuario.query().where("usuario", usuario);
    if (guardia.length != 0) return res.send({ response: false, message: "ya está registrado" });
    await Usuario.query().insert({
        usuario,
        password: cryptPassword(password),
        institucion_id,
        tipo_usuario_id: 3
    });
    let created_user_id = await Usuario.query().where({ usuario });
    await Datosusuario.query().insert({
        usuario_id: created_user_id[0].id
    });
    return res.send({
        response: true
    });
});
router.post("/guardias/editar/:guardia_id", async (req, res) => {
    let { usuario, password, nombre, fono, correo, guardia_habilitado } = req.body;
    let { guardia_id } = req.params;
    let institucion_id = req.institucion_id;

    let guardia = await Usuario.query().where("id", guardia_id);
    if (guardia.length == 0) return res.send({ response: false, message: "no existe este usuario" });
    await Usuario.query().patch({
        usuario,
        guardia_habilitado,
    }).where({
        id: guardia_id,
        institucion_id
    });
    if (password != null && password != '') await Usuario.query().patch({ password: cryptPassword(password) }).where({
        id: guardia_id,
        institucion_id
    });
    await Datosusuario.query().patch({ nombre, fono, correo }).where({
        usuario_id: guardia_id
    });
    return res.send({
        response: true
    });
});

module.exports = router;
