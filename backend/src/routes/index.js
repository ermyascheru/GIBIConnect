const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/institutions', require('./institutions.routes'));
router.use('/programs', require('./programs.routes'));
router.use('/resources', require('./resources.routes'));
router.use('/research', require('./research.routes'));
router.use('/admissions', require('./admissions.routes'));
router.use('/scholarships', require('./scholarships.routes'));
router.use('/users', require('./users.routes'));
router.use('/academic_calendar', require('./academic_calendar.routes'));
router.use('/search', require('./search.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/health', require('./health.routes'));

module.exports = router;
