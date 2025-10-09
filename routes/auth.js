const express = require('express');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Register new user
router.post('/register', validateRegistration, authController.register);

// Login user
router.post('/login', validateLogin, authController.login);

// Get current user profile
router.get('/me', authenticateToken, authController.getProfile);

// Refresh token
router.post('/refresh', authenticateToken, authController.refreshToken);

module.exports = router;