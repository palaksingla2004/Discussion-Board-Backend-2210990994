const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const voteController = require('../controllers/voteController');

const router = express.Router();

// Vote on thread
router.post('/threads/:threadId', authenticateToken, voteController.voteOnThread);

// Vote on reply
router.post('/threads/:threadId/replies/:replyId', authenticateToken, voteController.voteOnReply);

// Get vote statistics for a thread
router.get('/threads/:threadId/stats', voteController.getVoteStats);

module.exports = router;