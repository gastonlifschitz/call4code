const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const { BedType } = require("./bedType");
const { StaffType } = require("./staffType");
const { SupplyType } = require("./supplyType");
const { RespiratoryDeficiencyType } = require("./respiratoryDeficiencyType");

const totalStaffSchema = new Schema({
  medicos: { type: Number, default: 0 },
  enfermeros: { type: Number, default: 0 },
  camilleros: { type: Number, default: 0 },
  administrativos: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const hospitalSchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true },
  region: { type: String, required: true, trim: true },
  staff: [{ type: totalStaffSchema }],
  total_camas_sigehos: { type: Number },
  institutionType: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

async function qryDashboardData() {
  const data = await Hospital.aggregate([
    {
      $lookup: {
        from: "beds",
        localField: "_id",
        foreignField: "_hospital",
        as: "beds"
      }
    },
    {
      $lookup: {
        from: "staffs",
        localField: "_id",
        foreignField: "_hospital",
        as: "staffs"
      }
    },
    {
      $lookup: {
        from: "supplies",
        localField: "_id",
        foreignField: "_hospital",
        as: "supplies"
      }
    },
    {
      $lookup: {
        from: "respiratorydeficiencies",
        localField: "_id",
        foreignField: "_hospital",
        as: "respdef"
      }
    }
  ]).sort("name");

  const qry = [];

  const bedTypes = await BedType.find().sort({ uxOrder: "asc" });
  const staffTypes = await StaffType.find().sort({ uxOrder: "asc" });
  const suppliesTypes = await SupplyType.find().sort({ uxOrder: "asc" });
  const respTypes = await RespiratoryDeficiencyType.find().sort({
    uxOrder: "asc"
  });

  let bedTitles = [];
  bedTypes.forEach(type => {
    const { description } = type;
    bedTitles.push(description);
  });

  let staffTitles = [];
  staffTypes.forEach(type => {
    const { description } = type;
    staffTitles.push(description);
  });

  let supplyTitles = [];
  suppliesTypes.forEach(type => {
    const { description } = type;
    supplyTitles.push(description);
  });

  let respTitles = [];
  respTypes.forEach(type => {
    const { description } = type;
    respTitles.push(description);
  });

  qry.push([
    "Hospital",
    ...bedTitles,
    ...supplyTitles,
    ...staffTitles,
    ...respTitles
  ]);

  for (let doc of data) {
    const { name } = doc; //_id: _hospital
    const { beds, staffs, supplies, respdef } = doc;

    let bedValues = [];

    for (let type of bedTypes) {
      const { _id } = type;

      let value = "-";
      const subGroup = beds.filter(bed => bed._type.equals(_id));

      if (subGroup)
        value = subGroup.reduce(
          (prev, current) => (prev += current.cantidad),
          0
        );

      const int = parseInt(value);
      const isNumber = !Number.isNaN(int);

      value = isNumber ? value : "-";

      bedValues.push(value);
    }

    let suppliesValues = [];
    suppliesTypes.forEach(type => {
      const { _id } = type;
      const index = supplies.findIndex(x => x._type.equals(_id));
      let value = "-";
      if (index > -1) value = supplies[index].dias;
      suppliesValues.push(value);
    });

    let staffValues = [];
    staffTypes.forEach(type => {
      const { _id } = type;
      const index = staffs.findIndex(x => x._type.equals(_id));
      let value = "-";
      if (index > -1) value = staffs[index].cantidad;
      staffValues.push(value);
    });

    let respValues = [];
    respTypes.forEach(type => {
      const { _id } = type;
      const index = respdef.findIndex(x => x._type.equals(_id));
      let value = "-";
      if (index > -1) value = respdef[index].cantidad;
      respValues.push(value);
    });

    qry.push([
      name,
      ...bedValues,
      ...suppliesValues,
      ...staffValues,
      ...respValues
    ]);
  }

  // console.log(qry);
  console.log("qry triggered...");
  const traspose = qry[0].map((col, i) => qry.map(row => row[i]));

  const table = {
    hospitals: [traspose[0]],
    beds: traspose.slice(1, 5),
    supplies: traspose.slice(5, 13),
    staff: traspose.slice(13, 17),
    respdef: traspose.slice(17)
  };

  return table;
}

function validateHospitalSchema(hospital) {
  const schema = {
    name: Joi.string().required(),
    region: Joi.string().required(),
    institutionType: Joi.string(),
    staff: Joi.array(),
    total_camas_sigehos: Joi.number()
  };

  return Joi.validate(hospital, schema);
}

module.exports.Hospital = Hospital;
module.exports.validate = validateHospitalSchema;
module.exports.qryDashboardData = qryDashboardData;
