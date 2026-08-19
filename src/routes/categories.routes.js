const express = require("express");
const router = express.Router();
const { getCategories, createCategory } = require("../controllers/categories.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get("/", getCategories);
router.post("/", authenticate, authorize('admin'), createCategory);

module.exports = router;
