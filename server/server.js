require("dotenv").config();

const config = require("config");
const pkg = require("../package.json");
const chalk = require("chalk");
const winston = require("winston");
const log = console.log;

const cors = require("cors");
const express = require("express");
const app = express();

const start = Date.now();

app.use(cors());
require("./startup/logging")(winston);
require("./startup/routes")(app);
require("./startup/mongodb")();

//Logging only on development environment
const protocol = config.get("protocol");
const host = process.env.docker || config.get("host");
const port = process.env.PORT || config.get("port");
const env = app.get("env");

if (env === "development") {
  const morgan = require("morgan");
  app.use(morgan("tiny"));
  console.log("morgan enabled");
} else {
  log(chalk.red("you are in P R O D"));
  require("./startup/prod")(app);
}

log(chalk.cyan(`host: ${host}\nport: ${port}\nenvironment: ${env}`));

log(
  chalk.green("%s booted in %dms - %s://%s:%s"),
  pkg.name,
  Date.now() - start,
  protocol,
  host,
  port
);

app.listen(port, () => {
  sendBootStatus("ready");
});

function sendBootStatus(status) {
  // don't send anything if we're not running in a fork
  if (!process.send) {
    return;
  }
  process.send({ boot: status });
}
