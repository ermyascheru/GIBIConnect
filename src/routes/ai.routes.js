const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.post('/prompt', aiController.prompt);

module.exports = router;
