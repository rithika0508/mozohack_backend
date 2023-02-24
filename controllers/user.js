const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const password = req.body.password;
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.secret
    );
    res.status(200).json({
      success: true,
      userInfo: user,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const signUp = async (req, res, next) => {
  try {
    let { name, phoneNumber, email, password } = req.body;
    password = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
    });
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.secret
    );
    res.status(201).json({ success: true, userInfo: user, token: token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    console.log(req.body);
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    console.log(req.user);
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    console.log(user);
    res.status(200).json({ success: true, userInfo: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    console.log(req.file);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        document: req.file.filename,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const getLenders = async (req, res, next) => {
  try {
    const amount = parseFloat(req.params.amt);
    const interestrate = parseFloat(req.params.interest);
    console.log(amount, interestrate);
    const users = await User.find();
    console.log(users);
    const lenders = await User.find({
      $and: [
        { amount: { $gte: amount } },
        { intrestrate: { $lte: interestrate } },
      ],
    });
    console.log(lenders);
    res.status(200).json({
      success: true,
      lenders,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const uploadbs = async (req, res, next) => {
  try {
    let bankStatements;
    bankStatements = req.files.bankStatements.map((n) => n.filename);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bankStatements,
      },
      {
        new: true,
      }
    );
    console.log(user);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};
module.exports = {
  signin,
  signUp,
  updateProfile,
  uploadDocument,
  getLenders,
  uploadbs,
  getUserDetails,
};
