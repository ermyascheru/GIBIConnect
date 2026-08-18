const express = require('express');
const router = express.Router();
const {
    getInstitutions,
    getInstitutionBySlug,
    createInstitution,
    updateInstitution,
    deleteInstitution
} = require('../controllers/institutions.controller');

router.get('/', getInstitutions);
router.get('/:slug', getInstitutionBySlug);
router.post('/', createInstitution);
router.put('/:id', updateInstitution);
router.delete('/:id', deleteInstitution);

module.exports = router;