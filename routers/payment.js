const express=require("express")
const auth=require("../auth/authentication")
const { createPayment} = require("../controllers/payment")
const router = express.Router();

router.post("/payment",auth,createPayment)

module.exports=router