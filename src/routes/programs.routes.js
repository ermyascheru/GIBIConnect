const express = require('express');
const router = express.Router({ mergeParams: true });
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
    getAllPrograms,
    getPrograms,
    getProgramById,
    createProgram,
    deleteProgram
} = require('../controllers/programs.controller');

// Public read routes
router.get('/', (req, res, next) => {
    if (req.params.departmentId) return getPrograms(req, res, next);
    return getAllPrograms(req, res, next);
});
router.get('/:id', getProgramById);

// Protected write routes
router.post('/', authenticate, createProgram);
router.delete('/:id', authenticate, authorize('admin'), deleteProgram);

module.exports = router;