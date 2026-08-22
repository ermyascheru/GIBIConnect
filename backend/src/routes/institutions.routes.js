const express = require('express');
const router = express.Router();
const institutionsController = require('../controllers/institutions.controller');
const validate = require('../middleware/validation.middleware');
const { createInstitutionSchema } = require('../validators/institutions.validator');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', institutionsController.getAllInstitutions);
router.get('/:id', institutionsController.getInstitutionById);
router.get('/:id/faculties', institutionsController.getInstitutionFaculties);
router.get('/:id/programs', institutionsController.getInstitutionPrograms);
router.get('/:id/admissions', institutionsController.getInstitutionAdmissions);
router.get('/:id/tuition', institutionsController.getInstitutionTuition);
router.get('/:id/scholarships', institutionsController.getInstitutionScholarships);
router.get('/:id/facilities', institutionsController.getInstitutionFacilities);
router.get('/:id/reviews', institutionsController.getInstitutionReviews);
router.get('/:id/resources', institutionsController.getInstitutionResources);
router.post('/', authenticate, authorize('admin'), validate(createInstitutionSchema), institutionsController.createInstitution);

module.exports = router;
