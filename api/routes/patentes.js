const express = require("express");
const router = express.Router();

const Patente = require("../models/Patente");
const Alerta = require("../models/Alerta");


/**
 * OBTENER PATENTES DEL USUARIO QUE ENVIÓ EL TOKEN DE AUTORIZACION
 * [get]
 * 
 * 
 * 
 */
router.get("/", require("../middlewares/checksession"), async (req, res) => {
  const userid = req.userid;
  const patentes = await Patente.query().where("usuario_id", userid);
  return res.send({
    response: false,
    data: patentes
  });
});
/**
 * PEDIR INFORMACION DE USUARIO SEGUN PATENTE
 * [GET]
 * 
 * PARAM: /:PATENTE
 * 
 */
router.get("/:patente", async (req, res) => {
  const patente = req.params.patente;
  const userPatenteInfo = await Patente.query()
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
    data: userPatenteInfo
  });
});
/**
 * BORRAR PATENTES, REQUIERE AUTORIZACION POR TOKEN
 * [DELETE]
 * 
 * PARAM: /:id_patente 
 * 
 */
router.delete(
  "/:patente_id",
  require("../middlewares/checksession"),
  async (req, res) => {
    const userid = req.userid;
    const { patente_id } = req.params;
    await Alerta.query().delete().where("patente_id", patente_id)
    await Patente.query()
      .delete()
      .where({ id: patente_id, usuario_id: userid });
    res.send({
      response: true
    });
  }
);
/**
 * CREAR PATENTES
 * BODY: 
 * {
 *  "patente": patente,
 *  "desc": descripcion
 * }
 */
router.post("/", require("../middlewares/checksession"), async (req, res) => {
  const userid = req.userid;
  const { patente, desc } = req.body;
  let formattedPatente = patente.toUpperCase();
  //let regExp = new RegExp("^[A-Z]{2}[A-Z]{2}[0-9]{2}");
  let regExp = new RegExp("^[A-Z0-9]{6}");
  let patenteIsValid = regExp.test(formattedPatente);
  if (!patenteIsValid) return res.send({ response: false, error: "Patente no es valida, formato AAAA-BBBB" });
  let patenteExists = await Patente.query().select("*").where({ patente: formattedPatente });
  if (patenteExists.length > 0) return res.send({ response: false, error: "Ya está registrada esta patente" })
  await Patente.query().insert({
    patente: formattedPatente,
    desc,
    usuario_id: userid
  });
  return res.send({
    response: true
  });
});
module.exports = router;
