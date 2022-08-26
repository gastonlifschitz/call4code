const express = require("express");
const router = express.Router();
const { sendEmail } = require("../services/email");
const { User } = require("../models/user");

router.post("/recovery", async (req, res) => {
  //Validation

  const { email, templateId } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("El usuario no existe.");

  const { nombre, clave, _id: _user } = user;
  const mailResponse = await sendEmail(
    mail,
    { nombre, clave, _user, type: "PasswordReminder" },
    templateId
  );

  res.status(200).send(mailResponse);
});

router.post("/", async (req, res) => {
  const { to, body, templateId } = req.body;

  const { nombre, texto, _user, type } = body;

  const mailResponse = await sendEmail(
    to,
    { nombre, texto, _user, type },
    templateId
  );

  res.status(200).send(mailResponse);
});

module.exports = router;
