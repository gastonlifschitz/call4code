const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const userTypeSchema = new Schema({
  description: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
});

const UserType = mongoose.model("UserType", userTypeSchema);

function validateUserType(userType) {
  const schema = {
    description: Joi.string().required()
  };

  return Joi.validate(userType, schema);
}

module.exports.UserType = UserType;
module.exports.validateUserType = validateUserType;
