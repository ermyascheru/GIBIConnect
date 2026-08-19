const reviewsRepository = require("../repositories/reviews.repository");

exports.createReview = async (req, res, next) => {
  try {
    const { entityType, entityId, rating, comment } = req.body;
    const userId = req.user ? req.user.id : null;
    const review = await reviewsRepository.create({ userId, entityType, entityId, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.getReviewsByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const reviews = await reviewsRepository.findByEntity(entityType, entityId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};
