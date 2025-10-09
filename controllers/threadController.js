const Thread = require('../models/Thread');

// Get all threads with filtering and pagination
const getAllThreads = async (req, res) => {
  try {
    const { category, tags, sort = 'recent', search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    // Filter by category - validate ObjectId
    if (category && category !== '') {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // If not a valid ObjectId, try to find category by name
        const Category = require('../models/Category');
        const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Search in title and content
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, lastActivity: -1 };
        break;
      case 'votes':
        sortOption = { lastActivity: -1 }; // Can't sort by array length directly
        break;
      case 'recent':
      default:
        sortOption = { lastActivity: -1, createdAt: -1 };
    }
    
    const skip = (page - 1) * limit;
    
    const threads = await Thread.find(query)
      .populate('author', 'username avatar reputation role')
      .populate('category', 'name color')
      .populate('tags', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Thread.countDocuments(query);
    
    res.json({
      threads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get threads error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single thread by ID
const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId)
      .populate('author', 'username avatar reputation role')
      .populate('category', 'name color')
      .populate('tags', 'name')
      .populate('replies.author', 'username avatar reputation role');
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Increment view count
    thread.views += 1;
    await thread.save();
    
    res.json(thread);
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new thread
const createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }
    
    const thread = new Thread({
      title,
      content,
      author: req.user._id,
      category,
      tags: tags || [],
      votes: [],
      replies: [],
      views: 0,
      isPinned: false,
      isLocked: false,
      lastActivity: new Date()
    });
    
    await thread.save();
    
    // Update category thread count
    const Category = require('../models/Category');
    await Category.findByIdAndUpdate(category, { $inc: { threadCount: 1 } });
    
    // Update tag usage counts
    if (tags && tags.length > 0) {
      const Tag = require('../models/Tag');
      await Tag.updateMany(
        { _id: { $in: tags } },
        { $inc: { usageCount: 1 } }
      );
    }
    
    await thread.populate('author', 'username avatar reputation role');
    await thread.populate('category', 'name color');
    await thread.populate('tags', 'name');
    
    res.status(201).json(thread);
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update thread
const updateThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const thread = await Thread.findById(req.params.threadId);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Check if user is author or admin
    if (thread.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this thread' });
    }
    
    thread.title = title;
    thread.content = content;
    thread.category = category;
    thread.tags = tags || thread.tags;
    thread.isEdited = true;
    thread.editedAt = new Date();
    
    await thread.save();
    
    await thread.populate('author', 'username avatar reputation role');
    await thread.populate('category', 'name color');
    await thread.populate('tags', 'name');
    
    res.json(thread);
  } catch (error) {
    console.error('Update thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete thread
const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Check if user is author or admin
    if (thread.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }
    
    await Thread.findByIdAndDelete(req.params.threadId);
    
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Delete thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread
};
