const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const RespiratoryDeficiencySchema = new Schema({
  _hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  _type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RespiratoryDeficiencyType",
    required: true
  },
  cantidad: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const RespiratoryDeficiency = mongoose.model(
  "RespiratoryDeficiency",
  RespiratoryDeficiencySchema
);

function validateRespiratoryDeficiencySchema(staff) {
  const schema = {
    _hospital: Joi.objectId().required(),
    _type: Joi.objectId().required(),
    cantidad: Joi.number().required()
  };

  return Joi.validate(staff, schema);
}

module.exports.respiratoryDeficiencySchema = RespiratoryDeficiencySchema;
module.exports.RespiratoryDeficiency = RespiratoryDeficiency;
module.exports.validate = validateRespiratoryDeficiencySchema;
