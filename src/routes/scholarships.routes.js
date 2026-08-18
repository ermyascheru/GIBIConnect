const express = require('express');
const router = express.Router({ mergeParams: true });
const scholarshipsController = require('../controllers/scholarships.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', scholarshipsController.getScholarships);
router.get('/:id', scholarshipsController.getScholarshipById);
router.post('/', authenticate, authorize('admin'), scholarshipsController.createScholarship);

module.exports = router;