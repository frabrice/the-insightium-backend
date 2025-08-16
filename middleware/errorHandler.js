const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const error = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(err.statusCode || 500).json(error);
};

module.exports = errorHandler;