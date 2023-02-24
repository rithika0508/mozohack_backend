const express = require("express");
const auth = require("../auth/authentication");
const multer = require("multer");
const nanoid = require("nanoid");

const router = express.Router();
const {
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
} = require("../controllers/loan");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "scanned_documents");
  },
  filename: async (req, file, cb) => {
    let id = nanoid();
    cb(null, id + ".pdf");
  },
});

const upload = multer({ storage });

router.post("/loan/request", auth, createLoan);
router.get("/loan/pendingRequests", auth, getPendingRequests);
router.patch("/loan/acceptRequest", auth, updateStatus);
router.get("/loan/lenderHistory", auth, lenderHistory);
router.get("/loan/borrowerHistory", auth, borrowersHistory);
router.post("/loan/repay", auth, repay);
router.post("/loan/amountbreakdown", auth, amountBreakDown);
router.post("/loan/deleteRequest",auth,deleteRequest)

//for creating and showing agreement to user
router.post("/createagreement", auth, createagreement);
router.get("/getagreement", getagreement);

// for uploading the agreement after signing
router.post(
  "/uploadscanneddoc",
  auth,
  upload.single("scanned_document"),
  uploadScannedcopy
);

router.post("/loan/downloadagreement", auth, downloadagreement);

module.exports = router;
