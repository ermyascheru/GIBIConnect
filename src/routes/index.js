const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/institutions', require('./institutions.routes'));
router.use('/faculties', require('./faculties.routes'));
router.use('/departments', require('./departments.routes'));
router.use('/academic-calendar', require('./academic_calendar.routes'));
router.use('/programs', require('./programs.routes'));
router.use('/admissions', require('./admissions.routes'));
router.use('/scholarships', require('./scholarships.routes'));
router.use('/resources', require('./resources.routes'));
router.use('/research', require('./research.routes'));
router.use('/tuition', require('./tuition.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/search', require('./search.routes'));
router.use('/health', require('./health.routes'));
router.use('/reviews', require('./reviews.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/facilities', require('./facilities.routes'));

module.exports = router;
