const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateReply } = require('../middleware/validation');
const replyController = require('../controllers/replyController');

const router = express.Router();

// Add reply to thread
router.post('/:threadId', authenticateToken, validateReply, replyController.addReply);

// Update reply
router.put('/:threadId/replies/:replyId', authenticateToken, validateReply, replyController.updateReply);

// Delete reply
router.delete('/:threadId/replies/:replyId', authenticateToken, replyController.deleteReply);

module.exports = router;