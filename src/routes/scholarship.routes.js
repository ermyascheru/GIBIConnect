const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarship.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

router.get('/institution/:institutionId', scholarshipController.getScholarshipsByInstitution);

router.post('/', authenticate, authorizeRoles('admin'), scholarshipController.createScholarship);


module.exports = router;