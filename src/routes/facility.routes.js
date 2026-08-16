const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facility.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

router.get('/institution/:institutionId', facilityController.getFacilitiesByInstitution);
router.post('/', authenticate, authorizeRoles('admin'), facilityController.createFacility);

module.exports = router;