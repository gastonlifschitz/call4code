const auth = require("../middleware/auth");

const { Transaction, validate } = require("../models/transaction");
const { Bed } = require("../models/bed");
const { Supply } = require("../models/supply");
const { Staff } = require("../models/staff");
const { RespiratoryDeficiency } = require("../models/respiratoryDeficiency");

const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const transaction = await Transaction.find().sort({ updated: "desc" });
  console.log("Getting all transactions...");
  res.send(transaction);
});

router.get("/lastUpdate/:hospitalId", auth, async (req, res) => {
  const { hospitalId: _hospital } = req.params;

  console.log("Getting last transaction date from ", _hospital);
  const transaction = await Transaction.find({ _hospital }).sort("-timestamp");

  if (!transaction[0]) res.send("-");

  const { timestamp } = transaction[0];

  res.send(timestamp);
});

router.post("/", auth, async (req, res) => {
  //Validation
  console.log(req.body);

  const { currentTransaction } = req.body;
  const {
    _hospital,
    _user,
    staff,
    supplies,
    beds,
    respiratoryDeficiencies,
  } = currentTransaction;

  const { error } = validate(currentTransaction);
  if (error) return res.status(400).send(error.details[0].message);

  const newTransaction = new Transaction({
    _hospital,
    _user,
    staff,
    supplies,
    respiratoryDeficiencies,
    beds,
  });

  const data = await newTransaction.save();
  const { _id: _transaction } = newTransaction;
  console.log(`saved transaction ... ${_transaction}`);

  for (let bed of beds) {
    console.log(bed);
    const { _id, cantidad } = bed;
    console.log(_id);
    await Bed.findOneAndUpdate(
      { _id },
      { cantidad },
      {
        upsert: true,
      }
    );
    console.log(`Updating bed ... ${_id}`);
  }

  for (let supply of supplies) {
    const { _type, dias } = supply;
    console.log({ supply });
    console.log(_type);

    await Supply.findOneAndUpdate(
      { _type, _hospital },
      { dias },
      {
        upsert: true,
      }
    );
    console.log(`Updating supply ... ${(_type, _hospital)}`);
  }

  for (let personel of staff) {
    const { _type, cantidad } = personel;
    await Staff.findOneAndUpdate(
      { _type, _hospital },
      { cantidad },
      {
        upsert: true,
      }
    );
    console.log(`Updating staff ... ${(_type, _hospital)}`);
  }

  for (let respiratoryDeficiency of respiratoryDeficiencies) {
    const { _type, cantidad } = respiratoryDeficiency;
    console.log(`Updating respiratoryDeficiency ... ${(_type, _hospital)}`);
    console.log(respiratoryDeficiency);

    const newValue = parseInt(cantidad);

    const update = [
      "5e8250824753a3a6c9e4b29c",
      "5e8250864753a3a6c9e4b29d",
    ].includes(_type)
      ? { $inc: { cantidad: newValue } }
      : { cantidad: newValue };

    await RespiratoryDeficiency.findOneAndUpdate({ _type, _hospital }, update, {
      upsert: true,
    });
  }

  return res.status(200).send(data);
});

module.exports = router;
