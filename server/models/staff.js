const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const staffSchema = new Schema({
  _hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  _type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffType",
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

const Staff = mongoose.model("Staff", staffSchema);

function validateStaffSchema(staff) {
  const schema = {
    _hospital: Joi.objectId().required(),
    _type: Joi.objectId().required(),
    cantidad: Joi.number().required()
  };

  return Joi.validate(staff, schema);
}

module.exports.staffSchema = staffSchema;
module.exports.Staff = Staff;
module.exports.staffSchema = staffSchema;
module.exports.validate = validateStaffSchema;
