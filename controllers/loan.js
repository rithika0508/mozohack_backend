// const { findByIdAndUpdate } = require("../models/loan.js");
const Loan = require("../models/loan.js");
const User = require("../models/user.js");
const scanned_doc = require("../scanned_doc/scanned_doc");
const pdf = require("html-pdf");
const path = require("path");
const createLoan = async (req, res, next) => {
  try {
    const borrower_id = req.user.id;
    let { lender_id, amount, interestrate, months } = req.body;
    amount = parseFloat(amount);
    interestrate = parseFloat(interestrate);
    months = parseInt(months);
    const interest_amount = (interestrate / 100) * amount * months;
    const interest_remaining = interest_amount;
    const total_amount = amount + interest_amount;
    const amount_remaining = total_amount - interest_amount;
    const loan_created = await Loan.create({
      borrower_id,
      lender_id,
      amount,
      interestrate,
      months,
      amount_remaining,
      total_amount,
      interest_remaining,
    });
    console.log(loan_created);
    res.status(201).json({
      success: true,
      loan_created,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getPendingRequests = async (req, res, next) => {
  try {
    const lender_id = req.user.id;
    const request = await Loan.find({ lender_id, status: "requested" });
    let data = [];
    for (let i = 0; i < request.length; i++) {
      let r = {};
      let borrower_details = await User.findById(request[i].borrower_id);
      r = {
        loanData: { ...request[i] },
        borrowerData: { ...borrower_details },
      };
      data.push(r);
    }
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const requestId = req.body.requestId;
    const updatedRequest = await Loan.findByIdAndUpdate(
      requestId,
      {
        status: "accepted",
        createdAt: Date.now(),
      },
      {
        new: true,
      }
    );
    const lender_details = await User.findById(req.user.id);
    const updated_lender_details = await User.findByIdAndUpdate(
      req.user.id,
      {
        amount: lender_details.amount - updatedRequest.amount,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      updatedRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const uploadScannedcopy = async (req, res, next) => {
  try {
    console.log(req.body.id);
    console.log(req.file);
    const data = await Loan.findByIdAndUpdate(
      req.body.id,
      {
        scanned_document: req.file.filename,
      },
      {
        new: true,
      }
    );
    console.log(data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const lenderHistory = async (req, res, next) => {
  try {
    const lender_id = req.user.id;
    console.log(lender_id)
    const data = await Loan.find({ lender_id, status: "accepted" });
    const finalData = [];
    for (let i = 0; i < data.length; i++) {
      let borrowers_details = await User.findById(data[i].borrower_id);
      let { name, phoneNumber, email, address, document } = borrowers_details;
      let months_pending =
        data[i].createdAt?.getMonth() +
        parseInt(data[i].months) -
        new Date().getMonth();
      let interest_amount =
        (parseFloat(data[i].interestrate) / 100) *
        parseFloat(data[i].amount) *
        parseInt(data[i].months);
      let amount_pending = data[i].amount_remaining;
      let interestrate = data[i].interestrate;
      let principalamount = data[i].amount;
      let total_amount = data[i].total_amount;
      finalData.push({
        name,
        phoneNumber,
        email,
        address,
        document,
        months_pending,
        interest_amount,
        amount_pending,
        interestrate,
        principalamount,
        total_amount,
      });
    }
    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const borrowersHistory = async (req, res, next) => {
  try {
    const borrower_id = req.user.id;
    const data = await Loan.find({ borrower_id, status: "accepted" });
    const finalData = [];
    for (let i = 0; i < data.length; i++) {
      let lender_details = await User.findById(data[i].lender_id);
      let { name, phoneNumber, email, address, document } = lender_details;
      let months_pending =
        data[i].createdAt?.getMonth() +
        parseInt(data[i].months) -
        new Date().getMonth();
      let interest_amount =
        (parseFloat(data[i].interestrate) / 100) *
        parseFloat(data[i].amount) *
        parseInt(data[i].months);
      let amount_pending = data[i].amount_remaining;
      let interestrate = data[i].interestrate;
      let principalamount = data[i].amount;
      let total_amount = data[i].total_amount;
      let requestId=data[i]._id
      finalData.push({
        name,
        phoneNumber,
        email,
        address,
        document,
        months_pending,
        interest_amount,
        amount_pending,
        interestrate,
        principalamount,
        total_amount,
        requestId
      });
    }
    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const repay = async (req, res, next) => {
  try {
    let { amount, requestId } = req.body;
    amount = parseFloat(amount);
    let loan = await Loan.findById(requestId);
    // let amount_remaing=loan.amount_remaining-amount
    let months_remaing =
      loan.createdAt?.getMonth() +
      parseInt(loan.months) -
      new Date().getMonth();
    let remaining_interest_amount = loan.interest_remaining;
    let current_interest =
      parseFloat(loan.interestrate / 100) *
      parseFloat(loan.amount) *
      months_remaing;
    let amount_remaing;
    let interest_remaining = loan.interest_remaining;
    console.log(interest_remaining, amount_remaing);
    if (remaining_interest_amount < current_interest) {
      amount_remaing = parseFloat(loan.amount_remaining) - amount;
    } else if (remaining_interest_amount >= current_interest) {
      let s =
        amount - parseFloat(loan.interestrate / 100) * parseFloat(loan.amount);
      if (s > 0) {
        amount_remaing = loan.amount_remaining - s;
        interest_remaining = interest_remaining - amount + s;
      } else {
        interest_remaining = interest_remaining - amount;
      }
    }
    let updatedRequest = await Loan.findByIdAndUpdate(
      requestId,
      {
        amount_remaining: amount_remaing,
        interest_remaining: interest_remaining,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const amountBreakDown = async (req, res, next) => {
  try {
    let { amount, requestId } = req.body;
    amount = parseFloat(amount);
    let loan = await Loan.findById(requestId);
    // let amount_remaing=loan.amount_remaining-amount
    let months_remaing =
      loan.createdAt?.getMonth() +
      parseInt(loan.months) -
      new Date().getMonth();
    let remaining_interest_amount = loan.interest_remaining;
    let current_interest =
      parseFloat(loan.interestrate / 100) *
      parseFloat(loan.amount) *
      months_remaing;
    let amount_paying;
    let interest_paying;
    console.log(remaining_interest_amount, current_interest);
    if (remaining_interest_amount < current_interest) {
      amount_paying = amount;
      interest_paying = 0;
    } else if (remaining_interest_amount >= current_interest) {
      let s =
        amount - parseFloat(loan.interestrate / 100) * parseFloat(loan.amount);
      if (s > 0) {
        amount_paying = s;
        interest_paying = amount - s;
      } else {
        interest_paying = amount;
        amount_paying = 0;
      }
    }
    res.status(200).json({
      success: true,
      amount_paying,
      interest_paying,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const createagreement = async (req, res, next) => {
  try {
    const borrower = await User.findById(req.user.id);
    const lender = await User.findById(req.body.id);

    pdf
      .create(scanned_doc(borrower.name, lender), {
        format: "Letter",
        orientation: "portrait",
        type: "pdf",
        timeout: 100000,
        border: 10,
        header: {
          height: "10mm",
        },
        footer: {
          height: "7mm",
        },
      })
      .toFile("agreement.pdf", (err) => {
        if (err) {
          throw new Error(err);
        }
        res.json({
          success: true,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

const getagreement = async (req, res, next) => {
  try {
    const filepath = path.join(__dirname, "../agreement.pdf");
    console.log(filepath);
    res.sendFile(filepath);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

const downloadagreement = async (req, res, next) => {
  try {
    const data = await Loan.findById(req.body.id);
    console.log(data);
    const filepath = path.join(
      __dirname,
      "../scanned_documents/" + data.scanned_document
    );
    res.sendFile(filepath);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
      error: error.message,
    });
  }
};

const deleteRequest=async(req,res,next)=>{
  try{
      const id=req.body.id
      const request=await Loan.deleteOne({_id:id})
      res.status(200).json({
        success:true
      })
  }
  catch(error){
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Something Went Wrong!",
      error:error.message
    })
  }
}

module.exports = {
  createLoan,
  getPendingRequests,
  updateStatus,
  lenderHistory,
  borrowersHistory,
  repay,
  amountBreakDown,
  createagreement,
  getagreement,
  uploadScannedcopy,
  downloadagreement,
  deleteRequest
};
