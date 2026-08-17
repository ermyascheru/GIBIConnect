const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getPrograms,
    getProgramById,
    createProgram,
    deleteProgram
} = require('../controllers/program.controller');

// Nested under /api/v1/departments/:departmentId/programs
router.get('/', getPrograms);
router.post('/', createProgram);

// Direct program endpoints
router.get('/:id', getProgramById);
router.delete('/:id', deleteProgram);

module.exports = router;