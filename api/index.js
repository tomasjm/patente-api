var express = require("express");
var app = express();
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");

const { Model } = require("objection");
const knex = require("./database");

const morganMiddleware = morgan(function(tokens, req, res) {
  return [
    chalk.green.bold("[" + tokens.method(req, res) + "]"),
    chalk.red.bold(tokens.status(req, res)),
    chalk.white("( route: " + tokens.url(req, res) + " )"),
    chalk.yellow(tokens["response-time"](req, res) + " ms")
  ].join(" ");
});

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

Model.knex(knex);

knex.raw("select 1+1 as result").then(function() {
  console.log("Conexión a base de datos establecida.");
});

app.get("/", async function(req, res) {
  res.send({
    response: true
  });
});

const userchecker = require("./middlewares/checksession");

app.use("/auth", require("./routes/authentication"));
app.use(
  "/datosusuario",
  require("./middlewares/checksession"),
  require("./routes/datosusuario")
);
app.use("/patentes", require("./routes/patentes"));
// app.use('/eventos', require("./middlewares/userchecker"), require("./routes/eventos"));
// app.use('/tipo', require("./routes/tipo"));
// app.use('/landing', require("./routes/landing"));

app.listen(3000, function() {
  console.log("Servidor montado en puerto: 3000!");
});
