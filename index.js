const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const cookieParser = require('cookie-parser');
PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(dbURL)
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch(() => {
    console.log('Cannot Establish Database connection');
  });

app.listen(PORT, () => {
  console.log(` App is listening at Port ${PORT}`);
});
