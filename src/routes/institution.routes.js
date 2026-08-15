const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');

router.get('/', institutionController.getAllInstitutions);
router.get('/:id', institutionController.getInstitutionById);
router.post('/', institutionController.createInstitution);
router.put('/:id', institutionController.updateInstitution);

module.exports = router;