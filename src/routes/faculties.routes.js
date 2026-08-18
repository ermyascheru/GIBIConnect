const express = require('express');
const router = express.Router({ mergeParams: true });
const { getFaculties, createFaculty, deleteFaculty } = require('../controllers/faculties.controller');

// Routes mounted at /api/v1/institutions/:institutionId/faculties
router.get('/', getFaculties);
router.post('/', createFaculty);

// Standalone route for delete: /api/v1/faculties/:id
router.delete('/faculties/:id', deleteFaculty);

module.exports = router;