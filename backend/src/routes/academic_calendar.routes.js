const express = require('express');
const router = express.Router();
const calendarRepository = require('../repositories/academic_calendar.repository');
const { successResponse } = require('../utils/response');

router.get('/', async (req, res, next) => {
  try {
    const institutionId = req.query.institution_id;
    let data;
    if (institutionId) {
      data = await calendarRepository.findByInstitutionId(institutionId);
    } else {
      data = await calendarRepository.findAll(req.query);
    }
    return successResponse(res, 200, 'Academic calendar events retrieved', data.rows || data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
