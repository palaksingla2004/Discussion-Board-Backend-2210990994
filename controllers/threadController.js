const Thread = require('../models/Thread');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const mongoose = require('mongoose');

// Get all threads with filtering and sorting
const getAllThreads = async (req, res) => {
  try {
    const { category, tag, search, sort = 'recent', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Category filter - handle both name and ObjectId
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Look up category by name
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // If category not found, return empty results
          return res.json({
            threads: [],
            pagination: { current: parseInt(page), pages: 0, total: 0 }
          });
        }
      }
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'votes':
        sortOption = { voteScore: -1 };
        break;
      case 'recent':
      default:
        sortOption = { lastActivity: -1, createdAt: -1 };
    }

    const threads = await Thread.find(query)
      .populate('author', 'username avatar reputation role')
      .populate('category', 'name color')
      .populate('tags', 'name color')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Thread.countDocuments(query);

    res.json({
      threads: threads.map(thread => ({
        _id: thread._id,
        id: thread._id,
        title: thread.title,
        content: thread.content.substring(0, 200) + (thread.content.length > 200 ? '...' : ''),
        author: thread.author,
        category: thread.category,
        tags: thread.tags,
        votes: thread.votes,
        voteScore: thread.voteScore,
        replyCount: thread.replyCount,
        views: thread.views,
        isPinned: thread.isPinned,
        isLocked: thread.isLocked,
        createdAt: thread.createdAt,
        lastActivity: thread.lastActivity
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get threads error:', error);
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

    // Convert tag names to tag IDs
    let tagIds = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          // Create new tag if it doesn't exist
          tag = new Tag({ name: tagName });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
    }

    // Create thread
    const thread = new Thread({
      title,
      content,
      author: req.user._id,
      category,
      tags: tagIds
    });

    await thread.save();

    // Update category thread count
    await Category.findByIdAndUpdate(category, { $inc: { threadCount: 1 } });

    // Update tag usage counts
    if (tagIds.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tagIds } },
        { $inc: { usageCount: 1 } }
      );
    }

    // Populate the thread
    await thread.populate('author', 'username avatar reputation role');
    await thread.populate('category', 'name color');
    await thread.populate('tags', 'name color');

    res.status(201).json({
      message: 'Thread created successfully',
      thread: {
        _id: thread._id,
        id: thread._id,
        title: thread.title,
        content: thread.content,
        author: thread.author,
        category: thread.category,
        tags: thread.tags,
        voteScore: thread.voteScore,
        replyCount: thread.replyCount,
        views: thread.views,
        createdAt: thread.createdAt
      }
    });
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get thread by ID
const getThreadById = async (req, res) => {
  try {
    const threadId = req.params.threadId || req.params.id;
    
    // Validate thread ID
    if (!threadId || threadId === 'undefined' || threadId === 'null') {
      return res.status(400).json({ message: 'Invalid thread ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).json({ message: 'Invalid thread ID format' });
    }

    const thread = await Thread.findById(threadId)
      .populate('author', 'username avatar reputation role')
      .populate('category', 'name color')
      .populate('tags', 'name color')
      .populate({
        path: 'replies.author',
        select: 'username avatar reputation role'
      });

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Increment view count
    thread.views += 1;
    await thread.save();

    res.json({
      _id: thread._id,
      id: thread._id,
      title: thread.title,
      content: thread.content,
      author: thread.author,
      category: thread.category,
      tags: thread.tags,
      votes: thread.votes,
      voteScore: thread.voteScore,
      replyCount: thread.replyCount,
      views: thread.views,
      isPinned: thread.isPinned,
      isLocked: thread.isLocked,
      replies: thread.replies,
      createdAt: thread.createdAt,
      lastActivity: thread.lastActivity
    });
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ message: 'Server error' });
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

    // Check authorization
    if (thread.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this thread' });
    }

    // Update fields
    if (title) thread.title = title;
    if (content) thread.content = content;
    if (category) thread.category = category;
    if (tags) thread.tags = tags;

    thread.isEdited = true;
    thread.editedAt = new Date();

    await thread.save();
    await thread.populate('author', 'username avatar reputation role');
    await thread.populate('category', 'name color');
    await thread.populate('tags', 'name color');

    res.json({
      message: 'Thread updated successfully',
      thread
    });
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

    // Check authorization
    if (thread.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }

    // Update category thread count
    await Category.findByIdAndUpdate(thread.category, { $inc: { threadCount: -1 } });

    // Update tag usage counts
    if (thread.tags && thread.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: thread.tags } },
        { $inc: { usageCount: -1 } }
      );
    }

    await Thread.findByIdAndDelete(req.params.threadId);

    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Delete thread error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add reply to thread
const addReply = async (req, res) => {
  try {
    const { content, parentReplyId } = req.body;
    
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    if (thread.isLocked) {
      return res.status(403).json({ message: 'Thread is locked' });
    }

    const newReply = {
      author: req.user._id,
      content,
      parentReply: parentReplyId || null,
      votes: [],
      replies: [],
      createdAt: new Date()
    };

    if (parentReplyId) {
      // Find parent reply and add as nested reply
      const findAndAddReply = (replies) => {
        for (let reply of replies) {
          if (reply._id.toString() === parentReplyId) {
            reply.replies.push(newReply);
            return true;
          }
          if (reply.replies && reply.replies.length > 0) {
            if (findAndAddReply(reply.replies)) {
              return true;
            }
          }
        }
        return false;
      };

      const found = findAndAddReply(thread.replies);
      if (!found) {
        return res.status(404).json({ message: 'Parent reply not found' });
      }
    } else {
      // Add as top-level reply
      thread.replies.push(newReply);
    }

    thread.lastActivity = new Date();
    await thread.save();

    // Populate the new reply
    await thread.populate('replies.author', 'username avatar reputation role');

    // Find the newly added reply
    let addedReply;
    if (parentReplyId) {
      const findReply = (replies) => {
        for (let reply of replies) {
          if (reply.author._id.toString() === req.user._id.toString() && 
              reply.content === content && 
              reply.createdAt.getTime() === newReply.createdAt.getTime()) {
            return reply;
          }
          if (reply.replies && reply.replies.length > 0) {
            const found = findReply(reply.replies);
            if (found) return found;
          }
        }
        return null;
      };
      addedReply = findReply(thread.replies);
    } else {
      addedReply = thread.replies[thread.replies.length - 1];
    }

    res.status(201).json({
      message: 'Reply added successfully',
      reply: {
        id: addedReply._id,
        content: addedReply.content,
        author: addedReply.author,
        voteScore: 0,
        parentReply: addedReply.parentReply,
        createdAt: addedReply.createdAt
      }
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update reply
const updateReply = async (req, res) => {
  try {
    const { content } = req.body;
    
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Find and update reply
    const findAndUpdateReply = (replies) => {
      for (let reply of replies) {
        if (reply._id.toString() === req.params.replyId) {
          // Check if user is author or admin
          if (reply.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new Error('Not authorized');
          }
          
          reply.content = content;
          reply.isEdited = true;
          reply.editedAt = new Date();
          return reply;
        }
        
        if (reply.replies && reply.replies.length > 0) {
          const found = findAndUpdateReply(reply.replies);
          if (found) return found;
        }
      }
      return null;
    };

    try {
      const updatedReply = findAndUpdateReply(thread.replies);
      if (!updatedReply) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      await thread.save();

      res.json({
        message: 'Reply updated successfully',
        reply: {
          id: updatedReply._id,
          content: updatedReply.content,
          isEdited: updatedReply.isEdited,
          editedAt: updatedReply.editedAt
        }
      });
    } catch (authError) {
      return res.status(403).json({ message: 'Not authorized to edit this reply' });
    }
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete reply
const deleteReply = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Find and remove reply
    const findAndRemoveReply = (replies, parentReplies = null, index = -1) => {
      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];
        
        if (reply._id.toString() === req.params.replyId) {
          // Check if user is author or admin
          if (reply.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new Error('Not authorized');
          }
          
          // Remove the reply
          replies.splice(i, 1);
          return true;
        }
        
        if (reply.replies && reply.replies.length > 0) {
          if (findAndRemoveReply(reply.replies, replies, i)) {
            return true;
          }
        }
      }
      return false;
    };

    try {
      const removed = findAndRemoveReply(thread.replies);
      if (!removed) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      await thread.save();

      res.json({ message: 'Reply deleted successfully' });
    } catch (authError) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllThreads,
  createThread,
  getThreadById,
  updateThread,
  deleteThread,
  addReply,
  updateReply,
  deleteReply
};
