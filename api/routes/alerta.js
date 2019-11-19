const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Datosusuario = require("../models/Datosusuario");
const Alerta = require("../models/Alerta");

router.get("/", require("../middlewares/checksession"), async (req, res) => {
    let userid = req.userid;
    let alertas = await Alerta.query().where("desde_usuario_id", userid).orderBy("fecha", "desc");
    return res.send({
        response: true,
        data: alertas
    });
});

router.get("/confirmar/:id_alerta", require("../middlewares/checksession"), async (req, res) => {
    let userid = req.userid;
    let { id_alerta } = req.params;
    await Alerta.query().patch({
        confirmado: true
    }).where({
        id: id_alerta,
        hacia_usuario_id: userid
    });
    return res.send({
        response: true
    });
});
router.get("/datosusuario/:id_alerta", require("../middlewares/checksession"), async (req, res) => {
    let userid = req.userid;
    let { id_alerta } = req.params;
    let alerta = await Alerta.query().select("datos_usuario.*").leftJoin(
        "datos_usuario",
        "alerta.hacia_usuario_id",
        "=",
        "datos_usuario.usuario_id"
    ).where({
        "alerta.id": id_alerta,
        "alerta.desde_usuario_id": userid
    });
    return res.send({
        response: true,
        data: alerta
    });
});
module.exports = router;
