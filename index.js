require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
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
app.use(authRoutes);
app.use(userRoutes);
app.use(jobRoutes);

// error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(` App is listening at Port ${PORT}`);
});
