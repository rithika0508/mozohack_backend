const mongoose = require("mongoose");
const loanSchema = mongoose.Schema({
  borrower_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  lender_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  amount: {
    type: mongoose.Types.Decimal128,
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "rejected"],
    default: "requested",
  },
  interestrate: {
    type: mongoose.Types.Decimal128,
  },
  months: {
    type: Number,
  },
  amount_remaining: {
    type: mongoose.Types.Decimal128,
  },
  total_amount: {
    type: mongoose.Types.Decimal128,
  },
  interest_remaining: {
    type: mongoose.Types.Decimal128,
  },
  createdAt: {
    type: Date,
  },
  scanned_document: String,
});

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
