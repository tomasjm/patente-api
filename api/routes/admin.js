const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Patente = require("../models/Patente");

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
module.exports = router;
