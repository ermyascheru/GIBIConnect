const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const errorPayload = {
        code: err.code || 'INTERNAL_ERROR',
        message,
        ...(err.details && { details: err.details })
    };

    return errorResponse(res, statusCode, message, errorPayload);
};

module.exports = errorHandler;