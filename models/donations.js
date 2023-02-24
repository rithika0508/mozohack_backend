const mongoose = require("mongoose");

const donationSchema = mongoose.Schema({
  donorname: {
    type: String,
    require: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    require: true,
  },
  documentOfProof: String,
  amount: {
    type: Number,
    require: true,
  },
  reason: String,
});

const Donation = mongoose.model("donation", donationSchema);
module.exports = Donation;
