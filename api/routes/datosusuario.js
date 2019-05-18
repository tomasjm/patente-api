const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Datosusuario = require("../models/Datosusuario");

router.post("/", async (req, res) => {
  const userid = req.userid;
  const { nombre, anexo, fono, correo } = req.body;
  const usuario = await Usuario.query().where("id", userid);
  if (usuario.length == 0) {
    return res.send({
      response: false,
      meesage: "no se ha encontrado al usuario"
    });
  }
  const datos_usuario = await Datosusuario.query().where("usuario_id", userid);
  if (datos_usuario.length == 0) {
    const newDatosUsuario = await Datosusuario.query().insert({
      nombre,
      anexo,
      fono,
      correo,
      usuario_id: userid
    });
    res.send({
      response: true,
      data: newDatosUsuario
    });
  } else {
    const newDatosUsuario = await Datosusuario.query()
      .patch({
        nombre,
        anexo,
        fono,
        correo
      })
      .where("usuario_id", userid);
    res.send({
      response: true,
      data: newDatosUsuario
    });
  }
});
module.exports = router;
