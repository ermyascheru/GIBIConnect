const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/prompt', authenticate, aiController.prompt);

module.exports = router;
