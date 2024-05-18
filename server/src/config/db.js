const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/27017"

const connectDB = async () => {
  try {
    await mongoose
      .connect(MONGODB_URI)
      .then(() => console.log("Databased Connected..."));

    mongoose.connection.on("error", (error) =>
      console.error("DB connection error: ", error)
    );
  } catch (error) {
    console.log("catched DB error: ", error);
  }
};

module.exports = {
  connectDB,
};
