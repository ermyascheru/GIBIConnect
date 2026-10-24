const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const upload = require('../middleware/upload.middleware');

// Middleware: Require authentication and admin role
const adminOnly = [authenticate, authorize('admin', 'moderator')];

// Dashboard & Stats
router.get('/stats', adminOnly, adminController.getStats);
router.get('/activity', adminOnly, adminController.getActivityLog);

// File Management
router.get('/files', adminOnly, adminController.listFiles);
router.get('/files/:id', adminOnly, adminController.getFile);
router.post('/upload', adminOnly, upload.array('files', 50), adminController.uploadFiles);
router.put('/files/:id', adminOnly, adminController.updateFile);
router.delete('/files/:id', adminOnly, adminController.deleteFile);

// Database Management
router.get('/database/stats', adminOnly, adminController.getDatabaseStats);
router.post('/database/backup', adminOnly, adminController.createBackup);
router.get('/database/export', adminOnly, adminController.exportDatabase);
router.post('/database/query', adminOnly, adminController.executeQuery);

// User Management
router.get('/users', adminOnly, adminController.listUsers);
router.get('/users/:id', adminOnly, adminController.getUser);
router.put('/users/:id', adminOnly, adminController.updateUser);
router.delete('/users/:id', adminOnly, adminController.deleteUser);

// Settings
router.get('/settings', adminOnly, adminController.getSettings);
router.put('/settings', adminOnly, adminController.updateSettings);

module.exports = router;
