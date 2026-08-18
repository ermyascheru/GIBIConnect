const express = require('express');
const router = express.Router();
const researchController = require('../controllers/research.controller');

router.get('/', researchController.getAll);

module.exports = router;
