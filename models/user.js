const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  bankAccountNumber: {
    type: String,
  },
  IFSCCode: {
    type: String,
  },
  amount: {
    type: mongoose.Types.Decimal128
  },
  intrestrate: {
    type: mongoose.Types.Decimal128,
  },
  months: {
    type: Number,
  },
  document: {
    type: String,
  },
  bankStatements:[String],
  CreatedAt: {
    type: Date,
    default: Date.now(),
  }
});

const user = mongoose.model("User", userSchema);
module.exports = user;
