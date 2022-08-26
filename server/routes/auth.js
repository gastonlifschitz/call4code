const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const user = await User.findOne({ dni: req.body.dni });
  if (!user) return res.status(404).send(`El usuario no existe.`);

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(404).send("La contraseña es incorrecta.");

  const token = user.generateAuthToken();

  console.log("Logged in!! here is the token", token);
  return res.status(200).send({ auth: "ok", token });
});

module.exports = router;
