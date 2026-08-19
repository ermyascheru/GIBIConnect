const express = require("express");
const router = express.Router();
const { createReview, getReviewsByEntity } = require("../controllers/reviews.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/", authenticate, createReview);
router.get("/institution/:entityId", getReviewsByEntity);

module.exports = router;
