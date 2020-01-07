const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config.json");

// METODOS DE ENCRIPTACION
const bcrypt = require("bcrypt");


const Usuario = require("../models/Usuario");
const Datosusuario = require("../models/Datosusuario");
const Validacion = require("../models/Validacion");

const cryptPassword = password => bcrypt.hashSync(password, 12);

const randomFixedInteger = length => Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));



router.post("/login", async (req, res) => {
  var { user, password } = req.body;
  user = user.toLowerCase();
  const cuenta = await Usuario.query().where("usuario", user); // SELECT * FROM usuarios WHERE usuario = tom
  if (cuenta.length > 0) {
    if (cuenta[0].blocked) return res.send({ response: false, type: "CUENTA_BLOQUEADA", message: "La cuenta se encuentra bloqueada, contacta con soporte" });
    if (!cuenta[0].disponible) return res.send({ response: false, type: "CUENTA_DESHABILITADA", message: "La cuenta no se encuentra habilitada, contacta con soporte" });
    if (!cuenta[0].correo_confirmado) return res.send({ response: false, type: "CORREO_CONFIRMADO", usuario_id: cuenta[0].id, message: "El correo registrado no está confirmado" });
    bcrypt.compare(password, cuenta[0].password, async (err, valido) => {
      if (err) {
        res.send({
          response: false,
          message: err
        });
      }
      if (valido) {
        const token = await jwt.sign(
          {
            id: cuenta[0].id,
            institucion_id: cuenta[0].institucion_id,
            exp: moment()
              .add("30", "day")
              .unix()
          },
          config.JWTKEY
        );
        await Usuario.query()
          .patch({ token })
          .where("usuario", user);
        res.send({
          response: true,
          data: {
            id: cuenta[0].id,
            tipo_usuario_id: cuenta[0].tipo_usuario_id,
            institucion_id: cuenta[0].institucion_id,
            guardia_habilitado: cuenta[0].guardia_habilitado,
            token
          }
        });
      } else {
        res.send({
          response: false,
          message: "Datos incorrectos"
        });
      }
    });
  } else {
    res.send({
      response: false,
      message: "Cuenta no existente"
    });
  }
});

router.post("/register", async (req, res) => {
  var { user, correo, password } = req.body;

  user = user.toLowerCase();

  const userAccount = await Usuario.query().where("usuario", user);
  const emailExists = await Datosusuario.query().where("correo", correo);
  if (emailExists.length > 0) return res.send({ response: false, message: "Este correo ya se encuentra registrado" });
  if (userAccount.length > 0) {
    res.send({
      response: false,
      message: "Este usuario ya se encuentra registrado"
    });
  } else {
    Usuario.query()
      .insert({
        usuario: user,
        password: cryptPassword(password),
        tipo_usuario_id: 4
      })
      .then(() => {
        const createdUser = await Usuario.query().where("usuario", user)
        await Datosusuario.query().insert({
          usuario_id: createdUser[0].id
        });
        return res.send({
          response: true
        });
      })
      .catch(err => {
        return res.send({
          response: false,
          message: err
        });
      });
  }
});

router.get("/check/:token", async (req, res) => {
  const token = req.params.token;
  if (token == null) return res.send({ response: false, message: "No hay token" });
  jwt.verify(token, config.JWTKEY, async (err, payload) => {
    if (payload) {
      const id_cuenta = payload.id;
      const user = await Usuario.query()
        .select("*")
        .leftJoin(
          "datos_usuario",
          "usuario.id",
          "=",
          "datos_usuario.usuario_id"
        ).leftJoin(
          "institucion",
          "usuario.institucion_id",
          "=",
          "institucion.id"
        )
        .where("usuario.id", id_cuenta);
      if (user[0].blocked) return res.send({ response: false, message: "Este usuario se encuentra bloqueado" });
      if (!user[0].disponible) return res.send({ response: false, message: "Este usuario no se encuentra habilitado" });
      if (!user[0].correo_confirmado) return res.send({ response: false, message: "El correo registrado no está confirmado" });
      if (user[0].token == token) {
        return res.send({
          response: true,
          data: user
        });
      } else {
        return res.send({
          response: false,
          message: "Se ha finalizado la sesión"
        });
      }
    } else {
      return res.send({
        response: false,
        message: "Este token ha expirado"
      });
    }
  });
});

router.get("/correo/verificar/:id_usuario", async (req, res) => {
  const id_usuario = req.params.id_usuario;
  const datosUsuario = await Datosusuario.query().where("usuario_id", id_usuario);
  if (datosUsuario.length > 0 && datosUsuario[0].correo_confirmado == 0) {
    const codigo_verificacion = randomFixedInteger(6);
    Validacion.query().insert({
      tipo: "CORREO_CONFIRMACION",
      codigo: codigo_verificacion,
      usuario_id: id_usuario
    });
    const DOMAIN = 'sandbox3e5fbd10915844f4a0fa04119c231657.mailgun.org';
    const api_key = "50d00ccc4d2cebb08ab8e86aa8d38759-713d4f73-faa0b5dd";
    const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
    const data = {
      from: 'PU-Kar <noreply@innovate.cl>',
      to: datosUsuario.correo,
      subject: 'Confirmar correo PU-Kar',
      text: `Código de confirmación: ${codigo_verificacion}`
    };
    mg.messages().send(data, function (error, body) {
      return res.send({
        response: true
      });
    })
  } else {
    return res.send({
      response: false,
      message: "No hay un correo asociado o ya está confirmado"
    });
  }
});

router.post("/correo/verificar", async (req, res) => {
  const { codigo, tipo } = req.body;

});

router.get("/logout/:token", async (req, res) => {
  const { token } = req.params;
  let user = await Usuario.query().patch({ token: null }).where("token", token);
  if (user == 1) return res.send({ response: true });
  else return res.send({ response: false });
});

router.get("/logout/:token", async (req, res) => {
  const { token } = req.params;
  let user = await Usuario.query().patch({ token: null }).where("token", token);
  if (user == 1) return res.send({ response: true });
  else return res.send({ response: false });
});

module.exports = router;
