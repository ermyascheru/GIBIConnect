const express = require('express');
const router = express.Router({ mergeParams: true });
const admissionsController = require('../controllers/admissions.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', admissionsController.getAdmissions);
router.get('/:id', admissionsController.getAdmissionById);
router.post('/', authenticate, authorize('admin'), admissionsController.createAdmission);

module.exports = router;