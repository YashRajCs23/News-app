const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) throw new Error("Missing MongoDB URI");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  return mongoose.connection;
}

module.exports = { connectDB };


