const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

router.get('/', async (req, res) => {
  try {
    await db.query('SELECT 1');
    return successResponse(res, 200, 'GIBIConnect Server and PostgreSQL healthy', { status: 'healthy' });
  } catch (err) {
    return errorResponse(res, 503, 'Database unavailable', { code: 'DB_UNAVAILABLE', message: err.message });
  }
});

module.exports = router;
