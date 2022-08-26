const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    uppercase: true,
    required: true,
    trim: true
  },
  dni: { type: String, unique: true, required: true, trim: true },
  email: {
    type: String,
    maxlenght: 255,
    lowercase: true,
    trim: true
  },
  _type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
    required: true
  },
  _hospital: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: ""
    }
  ],
  password: {
    type: String,
    minlength: 3,
    maxlenght: 16,
    required: true,
    trim: true
  },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      dni: this.dni,
      _hospital: this._hospital,
      _type: this._type,
      isAdmin: this.isAdmin,
      isActive: this.isActive
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUserSchema(user) {
  const schema = {
    name: Joi.string().required(),
    dni: Joi.string().required(),
    password: Joi.string().required(),
    _type: Joi.objectId().required(),
    _hospital: Joi.array(),
    email: Joi.string(),
    isActive: Joi.boolean(),
    isAdmin: Joi.boolean()
  };

  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUserSchema;
