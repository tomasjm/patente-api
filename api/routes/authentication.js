const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config.json");

// METODOS DE ENCRIPTACION
const bcrypt = require("bcrypt");
const salt = 12;
const cryptPassword = password => {
  return bcrypt.hashSync(password, salt);
};

const Usuario = require("../models/Usuario");

router.post("/login", async (req, res) => {
  var { user, password } = req.body;
  user = user.toLowerCase();
  const cuenta = await Usuario.query().where("user", user);
  if (cuenta.length > 0) {
    if (cuenta[0].blocked) return res.send({ response: false, message: "La cuenta se encuentra bloqueada, contacta con soporte" });
    if (!cuenta[0].disponible) return res.send({ response: false, message: "La cuenta no se encuentra habilitada, contacta con soporte" });
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
          .where("user", user);
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
  var { user, password } = req.body;

  user = user.toLowerCase();

  let regExp = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$"); // email
  let userIsValid = regExp.test(user);
  if (!userIsValid) return res.send({ response: false, message: "No has ingresado un correo válido" });
  const userAccount = await Usuario.query().where("user", user);
  if (userAccount.length > 0) {
    res.send({
      response: false,
      message: "Este usuario ya se encuentra registrado"
    });
  } else {
    Usuario.query()
      .insert({
        user,
        password: cryptPassword(password),
        tipo_usuario_id: 4
      })
      .then(() => {
        res.send({
          response: true
        });
      })
      .catch(err => {
        res.send({
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

router.get("/logout/:token", async (req, res) => {
  const { token } = req.params;
  let user = await Usuario.query().patch({ token: null }).where("token", token);
  if (user == 1) return res.send({ response: true });
  else return res.send({ response: false });
});

module.exports = router;
