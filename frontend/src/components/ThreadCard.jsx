import { Link } from 'react-router-dom'
import { FaArrowUp, FaArrowDown, FaComment, FaEye } from 'react-icons/fa'
import { formatRelativeTime } from '../utils/formatDate'
import './ThreadCard.css'

const ThreadCard = ({ thread }) => {
  const upvotes = thread.votes?.filter(v => v.type === 'upvote').length || 0
  const downvotes = thread.votes?.filter(v => v.type === 'downvote').length || 0
  const voteScore = upvotes - downvotes
  const totalVotes = upvotes + downvotes

  // Get thread ID safely
  const threadId = thread._id || thread.id
  
  if (!threadId) {
    console.error('Thread missing ID:', thread)
    return null
  }

  return (
    <div className="thread-card">
      <div className="thread-votes">
        <FaArrowUp className="vote-icon upvote" />
        <div className="vote-info">
          <span className="vote-score">{voteScore}</span>
          <span className="total-votes">{totalVotes} votes</span>
        </div>
        <FaArrowDown className="vote-icon downvote" />
      </div>
      <div className="thread-content">
        <Link to={`/thread/${threadId}`} className="thread-title">
          {thread.title}
        </Link>
        <div className="thread-meta">
          <span>by {thread.author?.username || 'Unknown'}</span>
          <span>{formatRelativeTime(thread.createdAt)}</span>
          {thread.category && (
            <span className="category-badge">{thread.category.name}</span>
          )}
        </div>
        <div className="thread-tags">
          {thread.tags?.map(tag => (
            <span key={tag._id} className="tag-badge">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="thread-stats">
          <span>
            <FaComment /> {thread.replies?.length || 0} replies
          </span>
          <span>
            <FaEye /> {thread.views || 0} views
          </span>
        </div>
      </div>
    </div>
  )
}

export default ThreadCard