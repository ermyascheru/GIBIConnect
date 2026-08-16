const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

router.get('/', institutionController.getAllInstitutions);
router.get('/:id', institutionController.getInstitutionById);

router.post('/', authenticate, authorizeRoles('admin'), institutionController.createInstitution);
router.put('/:id', authenticate, authorizeRoles('admin'), institutionController.updateInstitution);
router.delete('/:id', authenticate, authorizeRoles('admin'), institutionController.deleteInstitution);

module.exports = router;