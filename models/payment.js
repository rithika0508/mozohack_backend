const mongoose=require("mongoose")
const paymentSchema=mongoose.Schema({
    LoanId:{
        type:mongoose.Types.ObjectId,
        ref:"Loan"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    razarPayObjectStringfy: String,
    amount: String,
    currency: {
        type: String,
        default: "INR"
    },
    receipt: String,
    payment_id: String,
    razorpay_payment_id_res: String,
    razorpay_order_id_res: String,
    razorpay_signature_res: String,
},{
    timestamps:true
})
const paymentModel=mongoose.model("Payment",paymentSchema)
module.exports=paymentModel
