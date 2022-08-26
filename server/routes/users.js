const auth = require("../middleware/auth");

const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");
const cwd = process.cwd();
const fs = require("fs");

const upload = multer({ dest: path.join(cwd, "/") });

router.get("/", auth, async (req, res) => {
  const user = await User.find().sort({ updated: "desc" });
  console.log("Getting all users...");
  res.send(user);
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("_hospital", "", "Hospital");
  console.log("Getting all users...");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    dni,
    email,
    password,
    isActive,
    isAdmin,
    _type,
    _hospital
  } = req.body; //_tipo_usuario

  let user = await User.findOne({ dni });

  if (user) return res.status(400).send("El dni ya se encuentra registrado.");

  user = new User({
    name,
    dni,
    email,
    password,
    isActive,
    isAdmin,
    _type,
    _hospital
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  return res.status(200).send(user);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, dni, email, isActive, isAdmin, _type, _hospital } = req.body;

  const duplicate = await User.findOne({ dni });

  console.log({ duplicate }, req.params.id);

  if (duplicate && duplicate._id.toString() !== req.params.id)
    return res.status(400).send("El dni ya se encuentra registrado.");

  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { name, dni, email, isActive, isAdmin, _type, _hospital },
    {
      new: true
    }
  );

  if (!user)
    return res
      .status(404)
      .send(`El usuario con ID: ${req.params.id} no existe.`);

  return res.status(200).send(user);
});

router.post("/bulk", [upload.single("files"), auth], async (req, res) => {
  const { col } = req.body;
  const { path } = req.file;

  const jsonArray = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(path);

  console.log("jsonArray", jsonArray);

  if (col === "users") {
    jsonArray.map(async line => {
      const csvArray = line[0].split(";");

      try {
        const user = new User({
          _hospital: csvArray[0] ? csvArray[0].split(",") : [],
          name: csvArray[1],
          dni: csvArray[2],
          email: csvArray[3],
          password: csvArray[2],
          _type: csvArray[4],
          isAdmin: csvArray[5] ? true : false
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log(user.password);
        await user.save();
        console.log("user saved:", csvArray[0]);
      } catch (error) {
        console.log("user failed:", csvArray[0]);
        console.log(error);
      }
    });
  }

  //elimino temp file
  await fs.unlinkSync(path);

  return res.status(200).send(jsonArray);
});

module.exports = router;
