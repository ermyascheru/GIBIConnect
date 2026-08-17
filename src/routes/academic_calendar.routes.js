const express = require('express');
const router = express.Router();
const academicCalendarController = require('../controllers/academic_calendar.controller');
const authenticate = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

router.get('/institution/:institutionId', academicCalendarController.getCalendarsByInstitution);
router.post('/', authenticate, authorizeRoles('admin'), academicCalendarController.createCalendar);

module.exports = router;