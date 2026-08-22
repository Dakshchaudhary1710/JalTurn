const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
      console.log("MongoDB connected successfully via MONGO_URI");
      return;
    } catch (error) {
      console.warn("MongoDB connection to MONGO_URI failed:", error.message);
      console.log("Falling back to MongoMemoryServer...");
    }
  }

  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`In-Memory MongoDB started and connected successfully at ${mongoUri}`);
  } catch (err) {
    console.error("Failed to start in-memory MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

