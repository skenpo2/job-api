const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.connect(MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
