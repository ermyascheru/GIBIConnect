const express = require('express');
const router = express.Router();
const researchController = require('../controllers/research.controller');

router.get('/', researchController.getAll);
router.get('/:id', researchController.getById);

module.exports = router;
