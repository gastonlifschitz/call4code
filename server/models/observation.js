const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const transaccionSchema = new Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  _transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true
  },
  _type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ObservationType",
    required: true
  },
  comment: { type: String, trim: true, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Observation = mongoose.model("Observation", transaccionSchema);

function validateObservationSchema(Observation) {
  const schema = {
    _user: Joi.objectId().required(),
    _transaction: Joi.objectId(),
    _type: Joi.objectId().required(),
    comment: Joi.string().required()
  };

  return Joi.validate(Observation, schema);
}

module.exports.Observation = Observation;
module.exports.validate = validateObservationSchema;
