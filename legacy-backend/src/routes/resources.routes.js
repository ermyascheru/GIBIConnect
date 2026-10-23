const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resources.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { parseMultipart } = require('../middleware/upload.middleware');

// Public Resource Discovery
router.get('/', (req, res, next) => resourcesController.getResources(req, res, next));
router.get('/:id', (req, res, next) => resourcesController.getResourceById(req, res, next));
router.get('/:id/download', (req, res, next) => resourcesController.downloadResource(req, res, next));
router.get('/:id/stream', (req, res, next) => resourcesController.streamResource(req, res, next));
router.get('/:id/preview', (req, res, next) => resourcesController.streamResource(req, res, next));

// Multipart Binary Upload & Ingestion Endpoint
router.post('/upload', parseMultipart, (req, res, next) => resourcesController.uploadResource(req, res, next));
router.post('/', parseMultipart, (req, res, next) => resourcesController.uploadResource(req, res, next));

// Moderator / Admin Approval Workflow
router.patch('/:id/approve', authenticate, authorize('admin', 'moderator'), (req, res, next) => resourcesController.approveResource(req, res, next));
router.patch('/:id/reject', authenticate, authorize('admin', 'moderator'), (req, res, next) => resourcesController.rejectResource(req, res, next));

module.exports = router;
