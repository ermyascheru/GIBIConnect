const express = require('express');
const router = express.Router();
const { getInstitutions, getInstitutionBySlug, createInstitution } = require('../controllers/institution.controller');

router.get('/', getInstitutions);
router.get('/:slug', getInstitutionBySlug);
router.post('/', createInstitution);

module.exports = router;