const Category = require('../models/Category');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    res.json({
      categories: categories.map(cat => ({
        id: cat._id,
        name: cat.name,
        description: cat.description,
        color: cat.color,
        threadCount: cat.threadCount
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category || !category.isActive) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      category: {
        id: category._id,
        name: category.name,
        description: category.description,
        color: category.color,
        threadCount: category.threadCount,
        createdAt: category.createdAt
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new category (admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      description,
      color: color || '#007bff'
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: {
        id: category._id,
        name: category.name,
        description: category.description,
        color: category.color,
        threadCount: category.threadCount
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update category (admin only)
const updateCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: category._id }
      });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    category.name = name;
    category.description = description;
    category.color = color || category.color;

    await category.save();

    res.json({
      message: 'Category updated successfully',
      category: {
        id: category._id,
        name: category.name,
        description: category.description,
        color: category.color,
        threadCount: category.threadCount
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete category (admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.threadCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing threads. Move threads to another category first.' 
      });
    }

    await Category.findByIdAndDelete(req.params.categoryId);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle category active status (admin only)
const toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category: {
        id: category._id,
        name: category.name,
        isActive: category.isActive
      }
    });
  } catch (error) {
    console.error('Toggle category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategory
};