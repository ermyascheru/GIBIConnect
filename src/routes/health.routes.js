const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.status(200).json({
            data: { status: 'healthy' },
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (error) {
        console.error("Health check failed:", error);

        res.status(503).json({
            data: null,
            meta: { timestamp: new Date().toISOString() },
            error: {
                code: 'SERVICE_UNAVAILABLE',
                message: 'Database connection failed'
            }
        });
    }
});
module.exports = router;
