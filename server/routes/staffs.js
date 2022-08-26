const auth = require("../middleware/auth");
const { Staff, validate } = require("../models/staff");

const express = require("express");
const router = express.Router();

const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");
const cwd = process.cwd();
const fs = require("fs");

const upload = multer({ dest: path.join(cwd, "/") });

router.get("/", auth, async (req, res) => {
  const staff = await Staff.find().sort({ updated: "desc" });
  console.log("Getting all staffs...");
  res.send(staff);
});

router.get("/byhospital/:id", auth, async (req, res) => {
  const { id: _hospital } = req.params;
  const staff = await Staff.find({ _hospital });

  console.log("Getting staff from ", _hospital);
  res.send(staff);
});

router.post("/", auth, async (req, res) => {
  //Validation
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { cantidad, _hospital, _type } = req.body;

  const staff = new Staff({ cantidad, _hospital, _type });

  await staff.save();

  return res.status(200).send(staff);
});

router.put("/:id", auth, async (req, res) => {
  const { cantidad } = req.body;
  const staff = await Staff.findOneAndUpdate(
    { _id: req.params.id },
    { cantidad },
    {
      new: true
    }
  );

  if (!staff)
    return res
      .status(404)
      .send(`El personal con ID: ${req.params.id} no existe.`);

  return res.status(200).send(staff);
});

router.post("/bulk", [upload.single("files"), auth], async (req, res) => {
  const { col } = req.body;
  const { path } = req.file;

  const jsonArray = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(path);

  console.log("jsonArray", jsonArray);

  if (col === "staff") {
    jsonArray.map(async line => {
      const csvArray = line[0].split(";");
      try {
        const staff = new Staff({
          _hospital: csvArray[0],
          _type: csvArray[1],
          cantidad: csvArray[2]
        });

        await staff.save();
        console.log("staff saved:", csvArray[0]);
      } catch (error) {
        console.log("staff failed:", csvArray[0]);
        console.log(error);
      }
    });
  }

  //elimino temp file
  await fs.unlinkSync(path);
  return res.status(200).send(jsonArray);
});

module.exports = router;
