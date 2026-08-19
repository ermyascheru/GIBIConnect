const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const authorizeOwnerOrAdmin = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: resource restricted to profile owner or admin' });
};

router.get('/', authenticate, authorize('admin'), usersController.getAllUsers);
router.get('/:id', authenticate, authorizeOwnerOrAdmin, usersController.getUserById);

module.exports = router;
