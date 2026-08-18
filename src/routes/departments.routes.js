const express = require('express');
const router = express.Router({ mergeParams: true });
const departmentsController = require('../controllers/departments.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', departmentsController.getDepartments);
router.get('/:id', departmentsController.getDepartmentById);
router.post('/', authenticate, authorize('admin'), departmentsController.createDepartment);

module.exports = router;