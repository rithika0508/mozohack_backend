const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  signin,
  signUp,
  updateProfile,
  uploadDocument,
  getLenders,
  uploadbs,
  getUserDetails,
} = require("../controllers/user");
const auth = require("../auth/authentication");
const nanoid = require("nanoid");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "bankstatements");
  },
  filename: (req, file, cb) => {
    cb(null, nanoid(10) + ".png");
  },
});

const uploadFiles = multer({
  storage: multerStorage,
});

const parseFile = uploadFiles.fields([{ name: "bankStatements", maxCount: 3 }]);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "documents");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, req.user.id + ".png");
  },
});

const upload = multer({ storage });

router.post("/user/signin", signin);
router.post("/user/signup", signUp);
router.patch("/updateprofile", auth, updateProfile);
router.post("/uploaddocument", auth, upload.single("document"), uploadDocument);
router.get("/getlenders/:amt/:interest", auth, getLenders);
router.post("/uploadbankstatements", auth, parseFile, uploadbs);
router.get("/getuserdetails", auth, getUserDetails);
module.exports = router;
