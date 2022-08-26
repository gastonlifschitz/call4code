const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const supplySchema = new Schema({
  _type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupplyType",
    required: true
  },
  _hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  dias: { type: Number, required: true, Default: 0 },
  minimo: { type: Number, Default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const Supply = mongoose.model("Supply", supplySchema);

function validateSupplySchema(supply) {
  const schema = {
    _type: Joi.objectId().required(),
    _hospital: Joi.objectId().required(),
    dias: Joi.number().required()
  };

  return Joi.validate(supply, schema);
}

module.exports.Supply = Supply;
module.exports.supplySchema = supplySchema;
module.exports.validate = validateSupplySchema;
