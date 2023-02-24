const express = require("express");
const multer = require("multer");
const router = express.Router();
const nanoid = require("nanoid");

const {
  addDonation,
  getAllDonation,
  uploadDonationDoc,
  donationpayment,
  downloadDonationDoc,
} = require("../controllers/donation");
const auth = require("../auth/authentication");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "donation_docs");
  },
  filename: (req, file, cb) => {
    let id = nanoid();
    cb(null, id + ".pdf");
  },
});

const upload = multer({ storage });
router.post("/adddonation", auth, addDonation);
router.get("/getalldonations", auth, getAllDonation);
router.post(
  "/uploaddonationdoc",
  auth,
  upload.single("donationdoc"),
  uploadDonationDoc
);
router.post("/donationpayment", auth, donationpayment);
router.post("/downloadDonationDoc", auth, downloadDonationDoc);
module.exports = router;
