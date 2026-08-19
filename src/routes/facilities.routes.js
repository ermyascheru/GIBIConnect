const express = require("express");
const router = express.Router();
const { getFacilitiesByInstitution, createFacility } = require("../controllers/facilities.controller");

router.get("/institution/:institutionId", getFacilitiesByInstitution);
router.post("/", createFacility);

module.exports = router;
