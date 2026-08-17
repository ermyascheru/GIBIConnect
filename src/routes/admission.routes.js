const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admission.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

router.get('/institution/:institutionId', admissionController.getAdmissionsByInstitution);
router.post('/', authenticate, authorizeRoles('admin'), admissionController.createAdmission);

module.exports = router;