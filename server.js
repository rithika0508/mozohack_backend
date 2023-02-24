const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use("/documents", express.static(path.join(__dirname, "documents")));
app.use(
  "/bankstatements",
  express.static(path.join(__dirname, "bankstatements"))
);
app.use(
  "/donation_docs",
  express.static(path.join(__dirname, "donation_docs"))
);
app.use(express.json());
app.use(express.json({ limit: "100000000" }));

const ConnectDB = require("./config/db");
ConnectDB();

const userRoutes = require("./routers/user");
const loanRoutes = require("./routers/loan");
const paymentRoutes = require("./routers/payment");
const donationroutes = require("./routers/donation");
app.use(userRoutes);
app.use(loanRoutes);
app.use(paymentRoutes);
app.use(donationroutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});
