const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissions.controller');

router.get('/institution/:institutionId', admissionController.getByInstitution);
router.post('/', admissionController.create);
router.put('/:id', admissionController.update);
router.delete('/:id', admissionController.remove);

module.exports = router;