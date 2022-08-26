const auth = require("../middleware/auth");

const { Supply, validate } = require("../models/supply");

const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const supply = await Supply.find().sort({ updated: "desc" });
  console.log("Getting all supplies...");
  res.send(supply);
});

router.get("/dashboard", auth, async (req, res) => {
  const supply = await Supply.find().sort({ _hospital: "desc", _type: "desc" }).populate("_type", "", "SupplyType");
  console.log("Getting all supplies...");
  res.send(supply);
});

router.get("/byhospital/:id", async (req, res) => {
  const { id: _hospital } = req.params;
  const supply = await Supply.find({ _hospital })
    .sort({ updated: "desc" })
    .populate("_type", "", "SupplyType")
    .populate("_hospital", "name", "Hospital");

  console.log("Getting supplies from ", _hospital);
  res.send(supply);
});

router.post("/", auth, async (req, res) => {
  //Validation
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { _type, _hospital, dias } = req.body;

  supply = new Supply({ _type, _hospital, dias });

  await supply.save();

  return res.status(200).send(supply);
});

router.put("/:id", auth, async (req, res) => {
  const { dias } = req.body;
  const supply = await Supply.findOneAndUpdate(
    { _id: req.params.id },
    { dias },
    {
      new: true
    }
  );

  if (!supply)
    return res
      .status(404)
      .send(`El insumo con ID: ${req.params.id} no existe.`);

  return res.status(200).send(supply);
});

module.exports = router;
