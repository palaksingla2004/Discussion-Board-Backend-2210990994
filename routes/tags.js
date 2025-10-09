const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const tagController = require('../controllers/tagController');

const router = express.Router();

// Get all tags with optional search
router.get('/', tagController.getAllTags);

// Get popular tags
router.get('/popular', tagController.getPopularTags);

// Get single tag with threads
router.get('/:tagId', tagController.getTagById);

// Get tag suggestions based on partial input
router.get('/suggest/:partial', tagController.getTagSuggestions);

// Update tag (admin only)
router.put('/:tagId', authenticateToken, requireRole(['admin']), tagController.updateTag);

// Delete unused tag (admin only)
router.delete('/:tagId', authenticateToken, requireRole(['admin']), tagController.deleteTag);

// Merge tags (admin only)
router.post('/:tagId/merge', authenticateToken, requireRole(['admin']), tagController.mergeTags);

module.exports = router;