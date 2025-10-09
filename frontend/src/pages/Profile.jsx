import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userAPI } from '../services/api'
import { formatFullDate } from '../utils/formatDate'
import ThreadCard from '../components/ThreadCard'
import './Profile.css'

const Profile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      const [userRes, threadsRes] = await Promise.all([
        userAPI.getProfile(userId),
        userAPI.getUserThreads(userId)
      ])
      console.log('User response:', userRes.data)
      console.log('Threads response:', threadsRes.data)
      setUser(userRes.data)
      setThreads(threadsRes.data || [])
    } catch (error) {
      console.error('Error loading profile:', error)
      console.error('Error details:', error.response?.data)
      setUser(null)
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading profile...</div>
  }

  if (!user) {
    return (
      <div className="home">
        <div className="card">
          <h2>User Not Found</h2>
          <p>The user profile could not be loaded. Please check the URL or try again.</p>
          <p>User ID: {userId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2>{user.username}</h2>
            <div className="profile-stats">
              <span>Reputation: {user.reputation || 0}</span>
              <span>Joined: {formatFullDate(user.joinedAt)}</span>
              <span>Role: {user.role}</span>
            </div>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
          </div>
        </div>
      </div>

      <div className="profile-threads">
        <h3>Threads by {user.username}</h3>
        {threads.length === 0 ? (
          <p>No threads yet</p>
        ) : (
          threads.map(thread => (
            <ThreadCard key={thread._id} thread={thread} />
          ))
        )}
      </div>
    </div>
  )
}

export default Profile