const express = require("express");
const router = express.Router();

const Patente = require("../models/Patente");
const Datosusuario = require("../models/Datosusuario");

router.get("/", require("../middlewares/checksession"), async (req, res) => {
  const userid = req.userid;
  const patentes = await Patente.query().where("usuario_id", userid);
  return res.send({
    response: false,
    data: patentes
  });
});
router.get("/:patente", async (req, res) => {
  const patente = req.params.patente;
  const userinfo = await Patente.query()
    .select("*")
    .leftJoin(
      "datos_usuario",
      "patente.usuario_id",
      "=",
      "datos_usuario.usuario_id"
    )
    .where("patente", patente);
  res.send({
    response: true,
    data: userinfo
  });
});
router.delete(
  "/:id_patente",
  require("../middlewares/checksession"),
  async (req, res) => {
    const userid = req.userid;
    const patenteid = req.params.id_patente;
    const patente = await Patente.query()
      .delete()
      .where({ id: patenteid, usuario_id: userid });
    res.send({
      response: true
    });
  }
);
router.post("/", require("../middlewares/checksession"), async (req, res) => {
  const userid = req.userid;
  const { patente, desc } = req.body;
  const newPatente = await Patente.query().insert({
    patente,
    desc,
    usuario_id: userid
  });
  res.send({
    response: true
  });
});
module.exports = router;
