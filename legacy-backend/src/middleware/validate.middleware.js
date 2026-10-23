function validateBody(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: {
                    code: 'VALIDATION_ERROR',
                    message: errorMessage
                }
            });
        }
        
        req.body = value;
        next();
    };
}

module.exports = validateBody;
