const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const supplyTypeSchema = new Schema({
  description: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
});

const SupplyType = mongoose.model("SupplyType", supplyTypeSchema);

function validateSupplyType(supplyType) {
  const schema = {
    description: Joi.string().required()
  };

  return Joi.validate(supplyType, schema);
}

module.exports.SupplyType = SupplyType;
module.exports.validateSupplyType = validateSupplyType;
