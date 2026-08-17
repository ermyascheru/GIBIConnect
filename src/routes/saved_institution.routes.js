const express = require('express');
const router = express.Router();
const savedInstitutionController = require('../controllers/saved_institution.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/', authenticate, savedInstitutionController.saveInstitution);
router.get('/', authenticate, savedInstitutionController.getSavedInstitutions);
router.delete('/:institutionId', authenticate, savedInstitutionController.removeSavedInstitution);

module.exports = router;