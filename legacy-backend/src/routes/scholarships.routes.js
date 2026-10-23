const express = require('express');
const router = express.Router();
const scholarshipsRepository = require('../repositories/scholarships.repository');
const { successResponse } = require('../utils/response');

router.get('/', async (req, res, next) => {
  try {
    const data = await scholarshipsRepository.findAll(req.query);
    return successResponse(res, 200, 'Scholarships retrieved', data.rows, {
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
    const data = await scholarshipsRepository.findById(req.params.id);
    if (!data) {
      const err = new Error('Scholarship not found');
      err.statusCode = 404;
      throw err;
    }
    return successResponse(res, 200, 'Scholarship retrieved', data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
