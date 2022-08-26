const express = require("express");
const types = require("../routes/types");
const hospital = require("../routes/hospitals");
const user = require("../routes/users");
const supply = require("../routes/supplies");
const staff = require("../routes/staffs");
const bed = require("../routes/beds");
const transactions = require("../routes/transactions");
const observations = require("../routes/observations");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/types", types);
  app.use("/api/hospitals", hospital);
  app.use("/api/users", user);
  app.use("/api/supplies", supply);
  app.use("/api/staffs", staff);
  app.use("/api/beds", bed);
  app.use("/api/transactions", transactions);
  app.use("/api/observations", observations);
  app.use("/api/auth", auth);
  app.use(error);
};
