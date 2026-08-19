const reviewsRepository = require("../repositories/reviews.repository");

exports.createReview = async (req, res, next) => {
  try {
    const { 
      institution_id, 
      teaching_rating, 
      facility_rating, 
      campus_rating, 
      administration_rating, 
      comment 
    } = req.body;
    
    const user_id = req.user ? req.user.id : null;
    
    const review = await reviewsRepository.create({ 
      institution_id, 
      user_id, 
      teaching_rating, 
      facility_rating, 
      campus_rating, 
      administration_rating, 
      comment 
    });
    
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.getReviewsByEntity = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const reviews = await reviewsRepository.findByInstitution(entityId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};
