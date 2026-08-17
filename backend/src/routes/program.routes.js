const express = require('express');
const router = express.Router();
const programController = require('../controllers/program.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

router.get('/institution/:institutionId', programController.getProgramsByInstitution);
router.post('/', authenticate, authorizeRoles('admin'), programController.createProgram);

module.exports = router;