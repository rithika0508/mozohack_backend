const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    await mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("CONNECTED TO DATABASE!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
