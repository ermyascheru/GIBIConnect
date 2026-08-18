const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarship.controller');

router.get('/', scholarshipController.getAll);
router.get('/:id', scholarshipController.getById);
router.post('/', scholarshipController.create);
router.put('/:id', scholarshipController.update);
router.delete('/:id', scholarshipController.remove);

module.exports = router;