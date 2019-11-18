const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Patente = require("../models/Patente");

router.get("/estadisticas", async (req, res) => {
    let userCount = await Usuario.query().count("id");
    let patenteCount = await Patente.query().count("id");
    return res.send({
        response: true,
        data: {
            user_count: userCount,
            patente_count, patenteCount
        }
    });
});
module.exports = router;
