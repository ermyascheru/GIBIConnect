const express = require("express");
const router = express.Router();
const { getFaculties, getFacultyById } = require("../controllers/faculties.controller");

router.get("/", getFaculties);
router.get("/:id", getFacultyById);

module.exports = router;
