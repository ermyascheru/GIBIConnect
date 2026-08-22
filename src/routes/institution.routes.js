const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');
const authenticate = require('../middleware/auth.middleware');

router.get('/', institutionController.getAllInstitutions);
router.get('/:id', institutionController.getInstitutionById);

router.post('/', authenticate, institutionController.createInstitution);
router.put('/:id', authenticate, institutionController.updateInstitution);
router.delete('/:id', authenticate, institutionController.deleteInstitution);

module.exports = router;