const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateBody = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/user.validation');
const authenticate = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/register', validateBody(registerSchema), userController.register);
router.post('/login', validateBody(loginSchema), userController.login);
router.get('/me', authenticate, userController.getMe);
router.get('/admin-only', authenticate, requireRole('admin'), userController.getAdminData);

module.exports = router;