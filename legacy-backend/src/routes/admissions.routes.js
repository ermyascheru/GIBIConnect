const express = require('express');
const router = express.Router();
const admissionsRepository = require('../repositories/admissions.repository');
const { successResponse } = require('../utils/response');

router.get('/', async (req, res, next) => {
  try {
    const data = await admissionsRepository.findAll(req.query);
    return successResponse(res, 200, 'Admissions criteria retrieved', data.rows, {
      total: data.totalCount,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = await admissionsRepository.findById(req.params.id);
    if (!data) {
      const err = new Error('Admissions schedule not found');
      err.statusCode = 404;
      throw err;
    }
    return successResponse(res, 200, 'Admissions schedule retrieved', data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
