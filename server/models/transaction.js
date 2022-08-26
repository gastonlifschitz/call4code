const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const { supplySchema } = require("./supply");
const { staffSchema } = require("./staff");
const { bedSchema } = require("./bed");
const { respiratoryDeficiencySchema } = require("./respiratoryDeficiency");

const transactionSchema = new Schema({
  _hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  staff: [{ type: staffSchema }],
  supplies: [{ type: supplySchema }],
  respiratoryDeficiencies: [{type: respiratoryDeficiencySchema}],
  beds: [{ type: bedSchema }],
  timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

function validateTransactionSchema(transaction) {
  const schema = {
    _hospital: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    staff: Joi.array().required(),
    supplies: Joi.array().required(),
    beds: Joi.array().required(),
    respiratoryDeficiencies: Joi.array().required(),
    timestamp: Joi.date()
  };

  return Joi.validate(transaction, schema);
}

module.exports.Transaction = Transaction;
module.exports.validate = validateTransactionSchema;
