const express = require('express');
const router = express.Router();
const tuitionController = require('../controllers/tuition.controller');

router.get('/program/:programId', tuitionController.getTuition);

module.exports = router;
