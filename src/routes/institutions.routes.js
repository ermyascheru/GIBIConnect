const express = require('express');
const router = express.Router();
const institutionsController = require('../controllers/institutions.controller');
const validate = require('../middleware/validation.middleware');
const { createInstitutionSchema } = require('../validators/institution.validator');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', institutionsController.getAllInstitutions);
router.get('/:id', institutionsController.getInstitutionById);
router.post('/', authenticate, authorize('admin'), validate(createInstitutionSchema), institutionsController.createInstitution);
router.delete('/:id', authenticate, authorize('admin'), institutionsController.deleteInstitution);

module.exports = router;
