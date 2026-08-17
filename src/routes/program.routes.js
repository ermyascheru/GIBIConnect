const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getAllPrograms,
    getPrograms,
    getProgramById,
    createProgram,
    deleteProgram
} = require('../controllers/program.controller');

// Root program routes (mounted at /api/v1/programs)
router.get('/', (req, res, next) => {
    if (req.params.departmentId) {
        return getPrograms(req, res, next);
    }
    return getAllPrograms(req, res, next);
});

router.post('/', createProgram);
router.get('/:id', getProgramById);
router.delete('/:id', deleteProgram);

module.exports = router;