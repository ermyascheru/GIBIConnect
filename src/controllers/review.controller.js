const reviewService = require('../services/review.service');
const { reviewSchema } = require('../schemas/review.schema');

exports.getReviewsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const reviews = await reviewService.getReviewsByInstitution(institutionId);

        res.json({
            data: reviews,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const { error, value } = reviewSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const reviewData = {
            ...value,
            user_id: req.user.id
        };

        const newReview = await reviewService.createReview(reviewData);

        res.status(201).json({
            data: newReview,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};