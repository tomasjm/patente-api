const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Patente = require("../models/Patente");
const Tipousuario = require("../models/Tipousuario");
// METODOS DE ENCRIPTACION
const bcrypt = require("bcrypt");
const salt = 12;
const cryptPassword = password => {
    return bcrypt.hashSync(password, salt);
};

router.get("/estadisticas", async (req, res) => {
    let userCount = await Usuario.query().count("id as a");
    let patenteCount = await Patente.query().count("id as p");
    return res.send({
        response: true,
        data: {
            user_count: userCount[0].a,
            patente_count: patenteCount[0].p
        }
    });
});

/**
 * TIPO USUARIOS
 */
router.get("/tipos", async (req, res) => {
    let tipos = await Tipousuario.query();
    return res.send({
        response: true,
        data: tipos
    });
});
/**
 * GUARDIAS
 */
router.get("/guardias", async (req, res) => {
    let guardias = await Usuario.query().where("tipo_usuario_id", 2);
    return res.send({
        response: true,
        data: guardias
    });
});
router.post("/guardias/crear/:institucion_id", async (req, res) => {
    let { user, password } = req.body;
    let { institucion_id } = req.params;

    let guardia = await Usuario.query().where("user", user);
    if (guardia.length != 0) return res.send({ response: false, message: "ya está registrado" });
    await Usuario.query().insert({
        user,
        password: cryptPassword(password),
        institucion_id
    });
    return res.send({
        response: true
    });
});

/**
 * USUARIOS
 */
router.get("/usuarios/listar", async (req, res) => {
    let usuarios = await Usuario.query();
    return res.send({
        response: true,
        data: usuarios
    });
});
router.get("/usuarios/listar/:tipo_usuario_id", async (req, res) => {
    let { tipo_usuario_id } = req.params;
    let usuarios = await Usuario.query().where("tipo_usuario_id", tipo_usuario_id);
    return res.send({
        response: true,
        data: usuarios
    });
});
router.get("/usuarios/bloquear/:id_usuario", async (req, res) => {
    let { id_usuario } = req.params;
    await Usuario.query().patch({
        blocked: true
    }).where("id", id_usuario);
    return res.send({
        response: true
    });
});
router.get("/usuarios/desbloquear/:id_usuario", async (req, res) => {
    let { id_usuario } = req.params;
    await Usuario.query().patch({
        blocked: false
    }).where("id", id_usuario);
    return res.send({
        response: true
    });
});
module.exports = router;
