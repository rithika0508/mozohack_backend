const Donation = require("../models/donations");
const Payment = require("../models/payment");
const Razorpay = require("razorpay");
const path = require("path");
const addDonation = async (req, res, next) => {
  try {
    // console.log(req.body);
    const donation = await Donation.create({
      ...req.body,
      createdBy: req.user.id,
    });
    // console.log(donation);
    res.status(201).json({
      success: true,
      donation,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const getAllDonation = async (req, res, next) => {
  try {
    const donations = await Donation.find({});
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const uploadDonationDoc = async (req, res, next) => {
  try {
    console.log(req.file.filename);
    const donation = await Donation.findByIdAndUpdate(
      req.body.id,
      {
        documentOfProof: req.file.filename,
      },
      {
        new: true,
      }
    );
    console.log(donation);
    res.status(200).json({ success: true, donation });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZAR_PAY_ID,
  key_secret: process.env.RAZAR_PAY_SECRET,
});

const donationpayment = async (req, res, next) => {
  try {
    const check = await Donation.findById(req.body.id);
    if (!check) {
      return res.status(404).json({
        success: false,
        message: "No request found",
      });
    }

    const payment_capture = 1;
    const amount = check.amount * 100;
    const currency = "INR";
    const options = {
      amount: amount.toString(),
      currency,
      receipt: check._id,
      payment_capture,
    };

    const razorpayResponse = await razorpay.orders.create(options);

    const data = await Payment.create({
      userId: req.user.id,
      LoanId: req.body.id,
      razarPayObjectStringfy: JSON.stringify(razorpayResponse),
      amount: razorpayResponse.amount,
      receipt: razorpayResponse.receipt,
      payment_id: razorpayResponse.id,
    });

    // Remove Unnecessary
    data.razarPayObjectStringfy = undefined;

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const downloadDonationDoc = async (req, res, next) => {
  try {
    const data = await Donation.findById(req.body.id);
    if (!data.documentOfProof) {
      res
        .status(500)
        .json({ success: false, message: "File Not present", error: error });
    }
    const filepath = path.join(
      __dirname,
      "../donation_docs/" + data.documentOfProof
    );
    res.sendFile(filepath);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

module.exports = {
  addDonation,
  getAllDonation,
  uploadDonationDoc,
  donationpayment,
  downloadDonationDoc,
};
