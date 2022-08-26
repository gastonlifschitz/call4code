const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
Joi.objectId = require("joi-objectid")(Joi);

const bedSchema = new Schema({
  _type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BedType",
    required: true
  },
  _hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  // Obsoleto via req. sprint #3
  // pabellon: { type: String, required: true, trim: true, uppercase: true },
  // piso: { type: String, required: true, trim: true, uppercase: true },
  sala: { type: String, required: true, trim: true, uppercase: true },
  cantidad: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Bed = mongoose.model("Bed", bedSchema);

function validateBedSchema(bed) {
  const schema = {
    _type: Joi.objectId().required(),
    _hospital: Joi.objectId().required(),
    // Obsoleto via req. sprint #3
    // pabellon: Joi.string().required(),
    // piso: Joi.string().required(),
    sala: Joi.string().required(),
    cantidad: Joi.number().required()
  };

  return Joi.validate(bed, schema);
}

// Obsoleto via req. sprint #3
// async function getPabellonPisos(_hospital) {
//   return await Bed.aggregate([
//     { $match: { _hospital: mongoose.Types.ObjectId(_hospital) } },
//     { $sort: { _type: 1 } },
//     {
//       $group: {
//         _id: { pabellon: "$pabellon", piso: "$piso" }
//       }
//     },
//     {
//       $group: {
//         _id: { pabellon: "$_id.pabellon" },
//         pisos: {
//           $push: {
//             piso: "$_id.piso"
//           }
//         }
//       }
//     }
//   ]);
// }

async function getSubtotals(_hospital) {
  const subTotalByType = await Bed.aggregate([
    {
      $match: {
        _hospital: mongoose.Types.ObjectId(_hospital)
      }
    },
    {
      $group: {
        _id: {
          _type: "$_type"
        },
        subTotals: {
          $sum: "$cantidad"
        }
      }
    }
  ]);

  const fillType = await Bed.populate(subTotalByType, {
    path: "_id._type",
    model: "BedType"
  });

  let query;
  if (fillType[0]) {
    //Si hay al menos 1 resultado
    query = [];
    for (let doc of fillType) {
      const { _id } = doc._id._type;
      const { description } = doc._id._type;
      const { subTotals } = doc;
      query.push({
        _type: _id,
        description,
        subTotals
      });
    }
  }

  console.log(query);
  return query;
}

module.exports.Bed = Bed;
module.exports.bedSchema = bedSchema;
module.exports.validate = validateBedSchema;
module.exports.getSubtotals = getSubtotals;
// Obsoleto via req. sprint #3
// module.exports.getPabellonPisos = getPabellonPisos;
