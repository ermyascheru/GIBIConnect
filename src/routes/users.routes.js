const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize('admin'), usersController.getAllUsers);
router.get('/:id', authenticate, usersController.getUserById);

module.exports = router;