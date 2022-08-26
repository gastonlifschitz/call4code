const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const staffTypeSchema = new Schema({
  description: { type: String, required: true, trim: true },
  uxOrder: { type: Number, unique: true },
  timestamp: { type: Date, default: Date.now }
});

const StaffType = mongoose.model("StaffType", staffTypeSchema);

function validateStaffType(staffType) {
  const schema = {
    description: Joi.string().required(),
    uxOrder: Joi.number()
  };

  return Joi.validate(staffType, schema);
}

module.exports.StaffType = StaffType;
module.exports.validateStaffType = validateStaffType;
