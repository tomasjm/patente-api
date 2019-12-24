const express = require("express");
const router = express.Router();

const Institucion = require("../models/Institucion");

router.get("/", async (req, res) => {
    const instituciones = await Institucion.query();
    return res.send({ response: true, data: instituciones })
});



module.exports = router;
