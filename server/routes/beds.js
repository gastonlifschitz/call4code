const auth = require("../middleware/auth");
const { Bed, validate } = require("../models/bed");
const { getSubtotals } = require("../models/bed");

const express = require("express");
const router = express.Router();

const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");
const cwd = process.cwd();
const fs = require("fs");

const upload = multer({ dest: path.join(cwd, "/") });

router.get("/", auth, async (req, res) => {
  const bed = await Bed.find().sort({ updated: "desc" });
  console.log("Getting all beds...");
  res.send(bed);
});

// Obsoleto via req. sprint #3
// router.get("/filtersbyhospital/:id", auth, async (req, res) => {
//   const { id: _hospital } = req.params;

//   const filter = await getPabellonPisos(_hospital);
//   const data = [];

//   for (let doc of filter) {
//     const { _id, pisos } = doc;
//     const { pabellon } = _id;
//     data.push({ pabellon, pisos });
//     let ind = 0;
//     for (let doc of pisos) {
//       const { piso } = doc;
//       const salas = await Bed.find({ _hospital, pabellon, piso }).distinct(
//         "sala"
//       );

//       data[data.length - 1].pisos[ind].salas = [];
//       for (let sala of salas) {
//         const beds = await Bed.find({
//           _hospital,
//           pabellon,
//           piso,
//           sala
//         }).populate("_type", "-timestamp -__v", "BedType");

//         data[data.length - 1].pisos[ind].salas.push({ sala, beds });
//       }

//       ind++;
//     }
//   }

//   console.log("Getting supplies from ", _hospital);

//   res.send(data);
// });

// Obsoleto via req. sprint #3
router.get("/subtotals/:_hospital", auth, async (req, res) => {
  console.log("Getting bed subtotales per type per hospital... ");
  const { _hospital } = req.params;
  const subtotals = await getSubtotals(_hospital);

  res.send(subtotals);
});

router.get("/byhospital/:id", auth, async (req, res) => {
  const { id: _hospital } = req.params;
  const beds = await Bed.find({ _hospital }).populate(
    "_type",
    "-_id description",
    "BedType"
  );

  console.log("Getting supplies from ", _hospital);
  res.send(beds);
});

router.post("/", auth, async (req, res) => {
  //Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { _type, _hospital, sala, cantidad } = req.body;

  let bed = await Bed.findOne({
    $and: [{ _hospital }, { _type }, { sala }]
  });

  if (bed) return res.status(400).send("La cama ya se encuentra registrada.");

  bed = new Bed({ _type, _hospital, sala, cantidad });

  await bed.save();

  return res.status(200).send(bed);
});

router.put("/:id", auth, async (req, res) => {
  const { cantidad } = req.body;
  const bed = await Bed.findOneAndUpdate(
    { _id: req.params.id },
    { cantidad },
    {
      new: true
    }
  );

  if (!bed)
    return res.status(404).send(`La cama con ID: ${req.params.id} no existe.`);

  return res.status(200).send(bed);
});

router.post("/bulk", [upload.single("files"), auth], async (req, res) => {
  const { col } = req.body;
  const { path } = req.file;

  const jsonArray = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(path);

  console.log("jsonArray", jsonArray);

  if (col === "beds") {
    jsonArray.map(async line => {
      const csvArray = line[0].split(";");
      try {
        const bed = new Bed({
          _hospital: csvArray[0],
          // Obsoleto via req. sprint #3
          // pabellon: csvArray[1],
          // piso: csvArray[2],
          sala: csvArray[1],
          cantidad: csvArray[2],
          _type: csvArray[3]
        });

        await bed.save();
        console.log("bed saved:", csvArray[0]);
      } catch (error) {
        console.log("bed failed:", csvArray[0]);
        console.log(error);
      }
    });
  }

  //elimino temp file
  await fs.unlinkSync(path);

  return res.status(200).send(jsonArray);
});

module.exports = router;
