const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const observationTypeSchema = new Schema({
  description: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
});

const ObservationType = mongoose.model(
  "ObservationType",
  observationTypeSchema
);

function validateObservationType(observationType) {
  const schema = {
    description: Joi.string().required()
  };

  return Joi.validate(observationType, schema);
}

module.exports.ObservationType = ObservationType;
module.exports.validateObservationType = validateObservationType;
