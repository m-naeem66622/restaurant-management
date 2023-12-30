const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
