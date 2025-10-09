
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
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid thread ID')
      setLoading(false)
      return
    }
    loadThread()
  }, [id])

  const loadThread = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading thread with ID:', id)
      const response = await threadAPI.getById(id)
      console.log('Thread loaded:', response.data)
      setThread(response.data)
    } catch (error) {
      console.error('Error loading thread:', error)
      setError(error.response?.data?.message || 'Failed to load thread')
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
      const response = await voteAPI.voteThread(id, type)
      console.log('Vote response:', response.data)
      // Reload thread to get updated vote counts
      await loadThread()
    } catch (error) {
      console.error('Vote error:', error)
      alert(error.response?.data?.message || 'Failed to vote')
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

  if (error) {
    return (
      <div className="home">
        <div className="card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="home">
        <div className="card">
          <h2>Thread Not Found</h2>
          <p>The thread you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Debug: Log votes data
  console.log('Thread votes:', thread.votes)
  console.log('Current user:', user)
  
  const upvotes = thread.votes?.filter(v => v.type === 'upvote').length || 0
  const downvotes = thread.votes?.filter(v => v.type === 'downvote').length || 0
  const voteScore = upvotes - downvotes
  
  // Check if current user has voted
  const userVote = user ? thread.votes?.find(v => {
    const voteUserId = typeof v.user === 'object' ? v.user._id || v.user.id : v.user
    const currentUserId = user._id || user.id
    console.log('Comparing vote user:', voteUserId, 'with current user:', currentUserId)
    return voteUserId?.toString() === currentUserId?.toString()
  }) : null
  
  console.log('User vote:', userVote)
  console.log('Vote score:', voteScore, '(upvotes:', upvotes, 'downvotes:', downvotes, ')')

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
            <button 
              onClick={() => handleVote('upvote')} 
              className={`vote-btn ${userVote?.type === 'upvote' ? 'active upvote' : ''}`}
              disabled={!user}
              title={!user ? 'Login to vote' : 'Upvote'}
            >
              <FaArrowUp />
            </button>
            <span className="vote-count">{voteScore}</span>
            <button 
              onClick={() => handleVote('downvote')} 
              className={`vote-btn ${userVote?.type === 'downvote' ? 'active downvote' : ''}`}
              disabled={!user}
              title={!user ? 'Login to vote' : 'Downvote'}
            >
              <FaArrowDown />
            </button>
          </div>
          {user && (user._id === thread.author?._id || user.id === thread.author?._id) && (
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