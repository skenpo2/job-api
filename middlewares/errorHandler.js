const errorHandler = (err, req, res, next) => {
  // error logger here

  console.log(err.stack);

  // return the error
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status).json({ message: err.message, isError: true });
};

module.exports = errorHandler;
