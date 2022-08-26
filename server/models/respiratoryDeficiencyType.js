const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const respiratoryDeficiencyTypeSchema = new Schema({
  description: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
});

const RespiratoryDeficiencyType = mongoose.model("RespiratoryDeficiencyType", respiratoryDeficiencyTypeSchema);

function validatedRespiratoryDeficiencyType(respiratoryDeficiencyType) {
  const schema = {
    description: Joi.string().required()
  };

  return Joi.validate(respiratoryDeficiencyType, schema);
}

module.exports.RespiratoryDeficiencyType = RespiratoryDeficiencyType;
module.exports.validateRespiratoryDeficiencyType = validatedRespiratoryDeficiencyType;
