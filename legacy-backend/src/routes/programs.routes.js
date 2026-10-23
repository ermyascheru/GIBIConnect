const express = require('express');
const router = express.Router();
const programsRepository = require('../repositories/programs.repository');
const { successResponse } = require('../utils/response');

router.get('/', async (req, res, next) => {
  try {
    const data = await programsRepository.findAll(req.query);
    return successResponse(res, 200, 'Programs retrieved', data.rows, {
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
    const data = await programsRepository.findById(req.params.id);
    if (!data) {
      const err = new Error('Program not found');
      err.statusCode = 404;
      throw err;
    }
    return successResponse(res, 200, 'Program retrieved', data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
