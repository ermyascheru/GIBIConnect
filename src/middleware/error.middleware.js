const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || null;

    if (process.env.NODE_ENV === 'development' && statusCode === 500) {
        console.error('Unhandled Error:', err);
    }

    return errorResponse(res, statusCode, message, errors);
};

module.exports = errorHandler;