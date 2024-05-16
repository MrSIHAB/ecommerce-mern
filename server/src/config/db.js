const mongoose = require("mongoose");
const { MongoURI } = require("../secret");

const connectDB = async () => {
  try {
    await mongoose
      .connect(MongoURI)
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
