const { errorResponse } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
    return errorResponse(res, 404, `Route ${req.originalUrl} not found`);
};

module.exports = notFoundHandler;