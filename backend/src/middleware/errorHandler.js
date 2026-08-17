const errorHandler = (err, req, res, next) => {
    // 1. Log the error for our own debugging in the terminal
    console.error("🔥 Error caught by middleware:", err.message);

    // 2. Determine the status code (default to 500 Internal Server Error)
    const statusCode = err.statusCode || 500;

    // 3. Send the standard JSON response
    res.status(statusCode).json({
        data: null,
        meta: { timestamp: new Date().toISOString() },
        error: {
            code: statusCode === 500 ? 'SERVER_ERROR' : 'API_ERROR',
            message: err.message || 'An unexpected internal server error occurred'
        }
    });
};

module.exports = errorHandler;