const express = require("express");
const router = express.Router();
const { getFacilitiesByInstitution, createFacility } = require("../controllers/facilities.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.get("/institution/:institutionId", getFacilitiesByInstitution);
router.post("/", authenticate, authorize('admin'), createFacility);

module.exports = router;
