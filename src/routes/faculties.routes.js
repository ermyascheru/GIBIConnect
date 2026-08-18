const express = require('express');
const router = express.Router({ mergeParams: true });
const facultiesController = require('../controllers/faculties.controller');
const validate = require('../middleware/validation.middleware');
const { createFacultySchema } = require('../validators/faculty.validator');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', facultiesController.getFaculties);
router.get('/:id', facultiesController.getFacultyById);
router.post('/', authenticate, authorize('admin'), validate(createFacultySchema), facultiesController.createFaculty);
router.delete('/:id', authenticate, authorize('admin'), facultiesController.deleteFaculty);

module.exports = router;