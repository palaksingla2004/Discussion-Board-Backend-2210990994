const Thread = require('../models/Thread');

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

// Placeholder implementations for thread routes
const getAllThreads = (req, res) => {
  res.status(200).json({ message: 'getAllThreads placeholder' });
};

const createThread = (req, res) => {
  res.status(201).json({ message: 'createThread placeholder' });
};

const getThreadById = (req, res) => {
  res.status(200).json({ message: 'getThreadById placeholder' });
};

const updateThread = (req, res) => {
  res.status(200).json({ message: 'updateThread placeholder' });
};

const deleteThread = (req, res) => {
  res.status(200).json({ message: 'deleteThread placeholder' });
};

module.exports = {
  addReply,
  updateReply,
  deleteReply,
  getAllThreads,
  createThread,
  getThreadById,
  updateThread,
  deleteThread
};
