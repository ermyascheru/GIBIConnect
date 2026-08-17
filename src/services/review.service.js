const reviewRepository = require('../repositories/review.repository');

const getReviewsByInstitution = async (institutionId) => {
    return await reviewRepository.findByInstitutionId(institutionId);
};

const createReview = async (reviewData) => {
    return await reviewRepository.create(reviewData);
};

module.exports = {
    getReviewsByInstitution,
    createReview
};