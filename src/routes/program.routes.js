const express = require('express');
const router = express.Router();
const programController = require('../controllers/program.controller');

router.get('/institution/:institutionId', programController.getByInstitution);
router.get('/:id', programController.getById);
router.post('/', programController.create);
router.put('/:id', programController.update);
router.delete('/:id', programController.remove);

module.exports = router;