const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const institutionsRoutes = require('./institutions.routes');
const facultiesRoutes = require('./faculties.routes');
const departmentsRoutes = require('./departments.routes');
const programsRoutes = require('./programs.routes');
const admissionsRoutes = require('./admissions.routes');
const scholarshipsRoutes = require('./scholarships.routes');
const academicCalendarRoutes = require('./academic_calendar.routes');

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/institutions', institutionsRoutes);
router.use('/faculties', facultiesRoutes);
router.use('/departments', departmentsRoutes);
router.use('/programs', programsRoutes);
router.use('/admissions', admissionsRoutes);
router.use('/scholarships', scholarshipsRoutes);
router.use('/academic-calendar', academicCalendarRoutes);

module.exports = router;
