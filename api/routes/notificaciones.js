const express = require("express");
const router = express.Router();


const Usuario = require("../models/Usuario");
const Patente = require("../models/Patente");
const Alerta = require("../models/Alerta");

const moment = require("moment");
const uuidv4 = require('uuid/v4');

var notificationsJson = require("../notifications.json");
var notificationsType = notificationsJson['notifications'];

var admin = require("firebase-admin");
var serviceAccount = require("../sdk_key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://patente-push.firebaseio.com"
});

router.get("/savetoken/:firebase_token", require('../middlewares/checksession'), async (req, res) => {
    const { firebase_token } = req.params;
    const userid = req.userid;

    if (firebase_token == null && userid == null) return res.send({ response: false });
    let result = await Usuario.query().patch({ firebase_token }).where("id", userid);
    if (result) return res.send({ response: true });
    else res.send({ response: false });
});

router.get("/types", (req, res) => {
    return res.send({
        response: true,
        data: notificationsJson
    });
})

router.post("/send/:notification_type", require("../middlewares/checksession"), async (req, res) => {
    const { notification_type } = req.params;
    const { patente } = req.body;
    const userid = req.userid;
    let guardia = await Usuario.query().select("institucion.institucion").leftJoin(
        "institucion",
        "usuario.institucion_id",
        "=",
        "institucion.id"
    ).where('usuario.id', userid);
    if (patente == null) return res.send({ response: false });
    const patenteInfo = await Patente.query().where("patente", patente);
    if (patenteInfo.length == 0) return res.send({ response: false, error: "Patente no registrada" });
    const user = await Usuario.query().where("id", patenteInfo[0].usuario_id);
    if (user[0].token == null || user[0].token == '') return res.send({ response: false, error: "El usuario no tiene una sesión activa" });
    const notification_key = user[0].firebase_token;
    if (notification_key == null && notification_key == '') return res.send({ response: false, error: "no tiene key" });

    notificationsType.forEach(async item => {
        if (item.tipo == notification_type) {
            const notification_uuid = uuidv4();
            const fecha = moment().unix();
            await Alerta.query().insert({
                tipo: item.tipo,
                uuid: notification_uuid,
                desde_usuario_id: userid,
                hacia_usuario_id: user[0].id,
                patente_id: patenteInfo[0].id,
                fecha: fecha
            });
            let message = {
                notification: {
                    title: item.titulo,
                    body: item.mensaje
                },
                data: {
                    uuid: notification_uuid,
                    patente: patente,
                    fecha: fecha.toString(),
                    tipo: item.tipo,
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                    institucion: guardia[0].institucion
                },
                token: notification_key
            };
            admin.messaging().send(message)
                .then(async (response) => {
                    await Alerta.query().patch({ enviado: true }).where("uuid", notification_uuid);
                    return res.send({
                        response: true
                    });
                })
                .catch((error) => {
                    return res.send({
                        response: false,
                        error: "No se ha podido enviar la notificación"
                    });
                });
        }
    });
});



module.exports = router;
