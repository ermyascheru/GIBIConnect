const express = require('express');
const router = express.Router({ mergeParams: true });
const academicCalendarController = require('../controllers/academic_calendar.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', academicCalendarController.getEvents);
router.post('/', authenticate, authorize('admin'), academicCalendarController.createEvent);

module.exports = router;