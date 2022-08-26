const auth = require("../middleware/auth");

const { Observation, validate } = require("../models/observation");

const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const observation = await Observation.find().sort({ updated: "desc" });
  console.log("Getting all observations...");
  res.send(observation);
});

router.post("/", auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { _user, _type, _transaction, comment } = req.body;

  const observation = new Observation({
    _user,
    _type,
    _transaction,
    comment
  });

  await observation.save();

  return res.status(200).send(observation);
});

module.exports = router;
