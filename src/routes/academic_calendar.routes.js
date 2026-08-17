const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/academic_calendar.controller');

router.get('/institution/:institutionId', calendarController.getByInstitution);
router.post('/', calendarController.create);
router.put('/:id', calendarController.update);
router.delete('/:id', calendarController.remove);

module.exports = router;