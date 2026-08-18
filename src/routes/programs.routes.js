const express = require('express');
const router = express.Router({ mergeParams: true });
const programsController = require('../controllers/programs.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', programsController.getPrograms);
router.get('/:id', programsController.getProgramById);
router.post('/', authenticate, authorize('admin'), programsController.createProgram);
router.delete('/:id', authenticate, authorize('admin'), programsController.deleteProgram);

module.exports = router;