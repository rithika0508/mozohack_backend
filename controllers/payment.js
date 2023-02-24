const Payment = require("../models/payment");
const Loan = require("../models/loan");
const Razorpay = require("razorpay");
// const { customRandom, urlAlphabet } = require('nanoid')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const razorpay = new Razorpay({
    key_id: process.env.RAZAR_PAY_ID,
    key_secret: process.env.RAZAR_PAY_SECRET,
  });

  const createPayment = async (req, res, next) => {
    try {
      const check = await Loan.findById(req.body.id);
      if (!check) {
        return res.status(404).json({
          success: false,
          message: "No request found",
        });
      }
  
      const payment_capture = 1;
      console.log(req.body.amount)
      const amount = req.body.amount * 100;
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
      res.status(500).json({
        success: false,
        error: error,
      });
    }
  };


  module.exports = {
    createPayment,
  };