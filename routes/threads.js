const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateThread } = require('../middleware/validation');
const threadController = require('../controllers/threadController');

const router = express.Router();

// Get all threads with filtering and pagination
router.get('/', optionalAuth, threadController.getAllThreads);

// Create new thread
router.post('/', authenticateToken, validateThread, threadController.createThread);

// Get single thread by ID
router.get('/:threadId', optionalAuth, threadController.getThreadById);

// Update thread (only by author or admin)
router.put('/:threadId', authenticateToken, validateThread, threadController.updateThread);

// Delete thread (only by author or admin)
router.delete('/:threadId', authenticateToken, threadController.deleteThread);

module.exports = router;