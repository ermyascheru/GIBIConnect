const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        if (!schema) return next();

        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const details = error.details.map(err => err.message.replace(/"/g, ''));
            const customError = new Error('Validation Failed');
            customError.statusCode = 400;
            customError.details = details;
            return next(customError);
        }

        req[source] = value;
        next();
    };
};

module.exports = validate;