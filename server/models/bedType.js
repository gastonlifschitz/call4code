const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const bedTypeSchema = new Schema({
  description: { type: String, required: true, trim: true },
  autoUpdate: { type: Boolean, default: false },
  uxOrder: { type: Number, unique: true },
  timestamp: { type: Date, default: Date.now }
});

const BedType = mongoose.model("BedType", bedTypeSchema);

function validateBedType(bedType) {
  const schema = {
    description: Joi.string().required(),
    autoUpdate: Joi.boolean(),
    uxOrder: Joi.number()
  };

  return Joi.validate(bedType, schema);
}

module.exports.BedType = BedType;
module.exports.validateBedType = validateBedType;
