const express = require("express");
const router = express.Router();
const { createReview, getReviewsByEntity } = require("../controllers/reviews.controller");

router.post("/", createReview);
router.get("/:entityType/:entityId", getReviewsByEntity);

module.exports = router;
