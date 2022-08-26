const auth = require("../middleware/auth");
const { Hospital, validate, qryDashboardData } = require("../models/hospital");

const express = require("express");
const router = express.Router();

const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");
const cwd = process.cwd();
const fs = require("fs");

const upload = multer({ dest: path.join(cwd, "/") });

router.get("/", auth, async (req, res) => {
  const hospital = await Hospital.find().sort({
    name: "asc"
  });
  console.log("Getting all hospitals...");
  res.send(hospital);
});

router.get("/dashboard", auth, async (req, res) => {
  const hospital = await Hospital.find().sort({
    _id: "desc"
  });
  console.log("Getting all hospitals...");
  res.send(hospital);
});

router.get("/dash", auth, async (req, res) => {
  const data = await qryDashboardData();
  console.log("Getting all qryDashboardData...");
  res.send(data);
});

// router.get("/descendbyname", auth, async (req, res) => {
//   const hospital = await Hospital.find().sort({
//     name: "asc"
//   });
//   console.log("Getting all hospitals...");
//   res.send(hospital);
// });

router.post("/", auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    region,
    staff,
    total_camas_sigehos,
    institutionType
  } = req.body;

  let hospital = await Hospital.findOne({ name });

  if (hospital)
    return res.status(400).send("El hospital ya se encuentra registrado.");

  hospital = new Hospital({
    name,
    region,
    staff,
    total_camas_sigehos,
    institutionType
  });

  await hospital.save();

  return res.status(200).send(hospital);
});

router.post("/bulk", [upload.single("files"), auth], async (req, res) => {
  const { col } = req.body;
  const { path } = req.file;

  const jsonArray = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(path);

  if (col === "hospitals") {
    jsonArray.map(async line => {
      const csvArray = line[0].split(";");
      try {
        const staff = {
          medicos: csvArray[2],
          enfermeros: csvArray[3],
          camilleros: csvArray[4],
          administrativos: csvArray[5]
        };

        const hospital = new Hospital({
          name: csvArray[0],
          region: csvArray[1],
          staff,
          total_camas_sigehos: csvArray[6]
        });

        //name,region,medicos,enfermeros,camilleros,administrativos
        await hospital.save();
        console.log("hospital saved:", csvArray[0]);
      } catch (error) {
        console.log("hospital failed:", csvArray[0]);
        console.log(error);
      }
    });
  }

  //elimino temp file
  await fs.unlinkSync(path);

  return res.status(200).send(jsonArray);
});

router.put("/:id", auth, async (req, res) => {
  //Validation
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, region, staff, total_camas_sigehos } = req.body;

  const duplicate = await Hospital.findOne({ name });
  if (duplicate && duplicate._id.toString() !== req.params.id)
    return res.status(400).send("El hospital ya se encuentra registrado.");

  const currentHospital = await Hospital.findById(req.params.id);
  const { staff: currentStaff } = currentHospital;

  currentStaff.push(staff[0]);

  const data = { name, region, staff: currentStaff, total_camas_sigehos };

  const hospital = await Hospital.findOneAndUpdate(
    { _id: req.params.id },
    data,
    {
      new: true
    }
  );

  if (!hospital)
    return res
      .status(404)
      .send(`El hospital con ID: ${req.params.id} no existe.`);

  await hospital.save();

  return res.status(200).send(hospital);
});

module.exports = router;
