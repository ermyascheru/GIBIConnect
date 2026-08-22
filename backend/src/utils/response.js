const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: meta ? { timestamp: new Date().toISOString(), ...meta } : { timestamp: new Date().toISOString() },
    error: null
  });
};

const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    meta: { timestamp: new Date().toISOString() },
    error: error || { code: 'SERVER_ERROR', message }
  });
};

module.exports = {
  successResponse,
  errorResponse
};
