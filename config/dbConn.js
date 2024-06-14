const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    const connect = await mongoose.connect(mongoURI);
    console.log(
      `Database Connected: ${connect.connection.host} ${connect.connection.name}`
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
