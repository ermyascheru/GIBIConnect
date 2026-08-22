const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorPayload = {
    code: err.code || 'SERVER_ERROR',
    message: err.message
  };

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('Unhandled Server Exception:', err);
    errorPayload.stack = err.stack;
  }

  return errorResponse(res, statusCode, message, errorPayload);
};

module.exports = errorHandler;
