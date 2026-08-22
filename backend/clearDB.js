const mongoose = require('mongoose');
require('dotenv').config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await mongoose.connection.db.dropDatabase();
    console.log("Dropped DB");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

clearDB();
