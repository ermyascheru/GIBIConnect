const { errorResponse } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return errorResponse(res, 400, 'Validation failed', { code: 'VALIDATION_ERROR', details });
    }
    req.body = value;
    next();
  };
};

module.exports = validate;
