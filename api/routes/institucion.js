const express = require("express");
const router = express.Router();

const Institucion = require("../models/Institucion");

router.get("/", async (req, res) => {
    const instituciones = await Institucion.query();
    return res.send({ response: true, data: instituciones })
});


router.post("/:institucion", require("../middlewares/checksession"), async (req, res) => {
    const { institucion } = req.params;
    const userid = req.userid;
    const user = await Usuario.query().where("id", userid);
    if (user, length == 0 || user[0].tipo_usuario_id != 1) return res.send({ response: false, message: "no tienes permiso" });
    const institucionExistente = await Institucion.query().where("institucion", institucion);
    if (institucionExistente.length != 0) return res.send({ response: false, message: "Ya está registrada esta institución" });
    let institucionResp = await Institucion.insert({ institucion });
    if (institucionResp) return res.send({ response: true });

    return res.send({
        response: false,
        message: "No se ha podido crear un registro de la institución"
    });
});


router.delete("/:id_institucion", require("../middlewares/checksession"),
    async (req, res) => {
        const userid = req.userid;
        const user = Usuario.query().where('id', userid);
        if (user[0].tipo_usuario_id != 1) return res.send({ response: false, message: "No eres administrador" });
        const institucionid = req.params.id_institucion;
        const institucion = await Patente.query()
            .delete()
            .where({ id: institucionid });
        return res.send({
            response: true
        });
    }
);
module.exports = router;
