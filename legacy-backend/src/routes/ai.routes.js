const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public / User AI Consultation endpoints
router.post('/chat', (req, res, next) => aiController.chat(req, res, next));
router.post('/consult', (req, res, next) => aiController.chat(req, res, next));
router.post('/prompt', (req, res, next) => aiController.chat(req, res, next));

// Semantic Vector Search endpoint
router.post('/search', (req, res, next) => aiController.search(req, res, next));
router.get('/search', (req, res, next) => aiController.search(req, res, next));

// Ingestion endpoints (Admin/Moderator authorized or system initialization)
router.post('/ingest', (req, res, next) => aiController.ingest(req, res, next));

// AI Health Check endpoint
router.get('/health', (req, res, next) => aiController.health(req, res, next));

module.exports = router;
