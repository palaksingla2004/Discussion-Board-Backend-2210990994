const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get single category
router.get('/:categoryId', categoryController.getCategoryById);

// Create new category (admin only)
router.post('/', authenticateToken, requireRole(['admin']), validateCategory, categoryController.createCategory);

// Update category (admin only)
router.put('/:categoryId', authenticateToken, requireRole(['admin']), validateCategory, categoryController.updateCategory);

// Delete category (admin only)
router.delete('/:categoryId', authenticateToken, requireRole(['admin']), categoryController.deleteCategory);

// Toggle category active status (admin only)
router.patch('/:categoryId/toggle', authenticateToken, requireRole(['admin']), categoryController.toggleCategory);

module.exports = router;