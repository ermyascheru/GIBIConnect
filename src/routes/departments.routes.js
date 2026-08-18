const express = require('express');
const router = express.Router({ mergeParams: true });
const { getDepartments, createDepartment } = require('../controllers/departments.controller');

router.get('/', getDepartments);
router.post('/', createDepartment);

module.exports = router;