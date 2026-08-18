const express = require('express');
const router = express.Router({ mergeParams: true });
const facultiesController = require('../controllers/faculties.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', facultiesController.getFaculties);
router.get('/:id', facultiesController.getFaculties);
router.post('/', authenticate, authorize('admin'), facultiesController.createFaculty);
router.delete('/:id', authenticate, authorize('admin'), facultiesController.deleteFaculty);

module.exports = router;