const auth = require("../middleware/auth");

const { SupplyType, validateSupplyType } = require("../models/supplyType");
const {
  ObservationType,
  validateObservationType
} = require("../models/observationType");
const { UserType, validateUserType } = require("../models/userType");
const { StaffType, validateStaffType } = require("../models/staffType");
const { BedType, validateBedType } = require("../models/bedType");
const { RespiratoryDeficiencyType, validateRespiratoryDeficiencyType } = require("../models/respiratoryDeficiencyType");

const express = require("express");
const router = express.Router();

const getTypes = {
  supply: SupplyType,
  observation: ObservationType,
  user: UserType,
  staff: StaffType,
  bed: BedType,
  respiratoryDeficiency:RespiratoryDeficiencyType
};

const validateTypes = {
  supply: value => validateSupplyType(value),
  observation: value => validateObservationType(value),
  user: value => validateUserType(value),
  staff: value => validateStaffType(value),
  bed: value => validateBedType(value),
  respiratoryDeficiency: value => validateRespiratoryDeficiencyType(value)
};

router.get("/:type", auth, async (req, res) => {
  console.log("get /:type triggered");
  const { type } = req.params;
  const data = await getTypes[type].find().sort({ uxOrder: "asc" });
  // const { data } = await srvAssets(xml);
  res.send(data);
});

router.post("/:type", auth, async (req, res) => {
  console.log("post /:type triggered");
  //Validation
  const { body } = req;
  const { type } = req.params;
  console.log({ type, body });
  const { error } = validateTypes[type](body);

  if (error) return res.status(400).send(error.details[0].message);

  const { description } = req.body;
  const newType = new getTypes[type]({ description });
  await newType.save();

  return res.status(200).send(newType);
});

module.exports = router;
