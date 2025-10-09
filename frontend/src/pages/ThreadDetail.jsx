
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { threadAPI, replyAPI, voteAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { formatRelativeTime } from '../utils/formatDate'
import Reply from '../components/Reply'
import './ThreadDetail.css'

const ThreadDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [thread, setThread] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadThread()
  }, [id])

  const loadThread = async () => {
    try {
      const response = await threadAPI.getById(id)
      setThread(response.data)
    } catch (error) {
      console.error('Error loading thread:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (type) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await voteAPI.voteThread(id, type)
      loadThread()
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    try {
      await replyAPI.create(id, { content: replyContent })
      setReplyContent('')
      loadThread()
    } catch (error) {
      console.error('Reply error:', error)
    }
  }

  const handleDeleteThread = async () => {
    if (window.confirm('Delete this thread?')) {
      try {
        await threadAPI.delete(id)
        navigate('/')
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading thread...</div>
  }

  if (!thread) {
    return <div className="loading">Thread not found</div>
  }

  const voteScore = thread.votes?.filter(v => v.type === 'upvote').length - 
                    thread.votes?.filter(v => v.type === 'downvote').length || 0

  return (
    <div className="thread-detail">
      <div className="thread-header">
        <h1>{thread.title}</h1>
        <div className="thread-meta-info">
          <span>by {thread.author?.username || 'Unknown'}</span>
          <span>{formatRelativeTime(thread.createdAt)}</span>
          {thread.category && <span className="category-badge">{thread.category.name}</span>}
          <span>{thread.views || 0} views</span>
        </div>
        <div className="thread-tags">
          {thread.tags?.map(tag => (
            <span key={tag._id} className="tag-badge">{tag.name}</span>
          ))}
        </div>
        <div className="thread-body">
          <p>{thread.content}</p>
        </div>
        <div className="thread-actions">
          <div className="vote-buttons">
            <button onClick={() => handleVote('upvote')} className="vote-btn">
              <FaArrowUp />
            </button>
            <span className="vote-count">{voteScore}</span>
            <button onClick={() => handleVote('downvote')} className="vote-btn">
              <FaArrowDown />
            </button>
          </div>
          {user && user._id === thread.author?._id && (
            <button onClick={handleDeleteThread} className="btn btn-danger">
              Delete Thread
            </button>
          )}
        </div>
      </div>

      <div className="replies-section">
        <h3>{thread.replies?.length || 0} Replies</h3>
        {user && (
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="form-control"
              required
            />
            <button type="submit" className="btn btn-primary">
              Post Reply
            </button>
          </form>
        )}
        <div className="replies-list">
          {thread.replies?.map(reply => (
            <Reply
              key={reply._id}
              reply={reply}
              threadId={id}
              onUpdate={loadThread}
              onDelete={loadThread}
              onReply={loadThread}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreadDetail