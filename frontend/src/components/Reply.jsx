import { useState } from 'react'
import { FaArrowUp, FaArrowDown, FaReply, FaEdit, FaTrash } from 'react-icons/fa'
import { formatRelativeTime } from '../utils/formatDate'
import { useAuth } from '../hooks/useAuth'
import { voteAPI, replyAPI } from '../services/api'
import './Reply.css'

const Reply = ({ reply, threadId, onUpdate, onDelete, onReply }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const voteScore = reply.votes?.filter(v => v.type === 'upvote').length - 
                    reply.votes?.filter(v => v.type === 'downvote').length || 0

  const handleVote = async (type) => {
    if (!user) return
    try {
      await voteAPI.voteReply(threadId, reply._id, type)
      onUpdate()
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  const handleEdit = async () => {
    try {
      await replyAPI.update(threadId, reply._id, { content: editContent })
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Edit error:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this reply?')) {
      try {
        await replyAPI.delete(threadId, reply._id)
        onDelete(reply._id)
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    try {
      await replyAPI.create(threadId, { content: replyContent, parentReply: reply._id })
      setReplyContent('')
      setShowReplyForm(false)
      onReply()
    } catch (error) {
      console.error('Reply error:', error)
    }
  }

  return (
    <div className="reply">
      <div className="reply-votes">
        <FaArrowUp onClick={() => handleVote('upvote')} className="vote-icon" />
        <span>{voteScore}</span>
        <FaArrowDown onClick={() => handleVote('downvote')} className="vote-icon" />
      </div>
      <div className="reply-content">
        <div className="reply-header">
          <span className="reply-author">{reply.author?.username || 'Unknown'}</span>
          <span className="reply-time">{formatRelativeTime(reply.createdAt)}</span>
        </div>
        {isEditing ? (
          <div className="reply-edit">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="form-control"
            />
            <div className="reply-edit-actions">
              <button onClick={handleEdit} className="btn btn-primary">Save</button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="reply-text">{reply.content}</p>
        )}
        <div className="reply-actions">
          {user && (
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-action-btn">
              <FaReply /> Reply
            </button>
          )}
          {user && user._id === reply.author?._id && (
            <>
              <button onClick={() => setIsEditing(true)} className="reply-action-btn">
                <FaEdit /> Edit
              </button>
              <button onClick={handleDelete} className="reply-action-btn">
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="form-control"
              required
            />
            <button type="submit" className="btn btn-primary">Submit Reply</button>
          </form>
        )}
        {reply.replies && reply.replies.length > 0 && (
          <div className="nested-replies">
            {reply.replies.map(nestedReply => (
              <Reply
                key={nestedReply._id}
                reply={nestedReply}
                threadId={threadId}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reply