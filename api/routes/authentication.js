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
    bcrypt.compare(password, cuenta[0].password, async (err, valido) => {
      if (err) {
        res.send({
          response: false,
          error: err
        });
      }
      if (valido) {
        const token = await jwt.sign(
          {
            id: cuenta[0].id,
            exp: moment()
              .add("30", "day")
              .unix()
          },
          config.JWTKEY
        );
        const patch = await Usuario.query()
          .patch({ token })
          .where("user", user);
        res.send({
          response: true,
          data: {
            id: cuenta[0].id,
            tipo_usuario_id: cuenta[0].tipo_usuario_id,
            token
          }
        });
      } else {
        res.send({
          response: false,
          err: "Datos incorrectos"
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
  var { user, password, institucion_id } = req.body;
  user = user.toLowerCase();
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
        tipo_usuario_id: 3,
        institucion_id
      })
      .then(() => {
        res.send({
          response: true
        });
      })
      .catch(err => {
        res.send({
          response: false,
          error: err
        });
      });
  }
});

router.get("/check/:token", async (req, res) => {
  const token = req.params.token;
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
        )
        .where("usuario.id", id_cuenta);
      if (user[0].token == token) {
        res.send({
          response: true,
          data: user
        });
      } else {
        res.send({
          response: false,
          message: "Se ha finalizado la sesión"
        });
      }
    } else {
      res.send({
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
// router.post("/renew", async (req, res) => {
//   const { token } = req.body;
//   jwt.verify(token, config.JWTKEY, async (err, payload) => {
//     if (payload) {
//       const id_account = payload.id;
//       const account = await Usuario.query().where("id", id_account);
//       if (account[0].auth_key == token) {
//         const token = jwt.sign(
//           {
//             id: account[0].id,
//             exp: moment()
//               .add("1", "hour")
//               .unix()
//           },
//           config.JWTKEY
//         );
//         await Usuario.query()
//           .patch({ auth_key: token })
//           .where("id", id_account)
//           .then(() => {
//             res.send({
//               response: true,
//               token
//             });
//           })
//           .catch(err => {
//             res.send({
//               response: false,
//               error: err
//             });
//           });
//       } else {
//         res.send({
//           response: false,
//           message: "Tokens no coincidentes"
//         });
//       }
//     } else {
//       res.send({
//         response: false,
//         message: "Token no valido"
//       });
//     }
//   });
// });

// router.get("/usuario/:token", async (req, res) => {
//   const token = req.params.token;
//   console.log(token);
//   const user = await Usuario.query()
//     .select("*")
//     .leftJoin("datos_usuario", "usuario.id", "=", "datos_usuario.usuario_id")
//     .where("token", token);
//   console.log(user);
//   if (user.length == 0) {
//     return res.send({
//       response: false,
//       message: "Este token no está asociado a un usuario"
//     });
//   }
//   res.send({
//     response: true,
//     user
//   });
// });
module.exports = router;
