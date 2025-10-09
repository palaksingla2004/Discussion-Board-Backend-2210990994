import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Get user ID safely
  const getUserId = () => {
    if (!user) return null
    return user._id || user.id
  }

  const userId = getUserId()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Forum
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user && userId ? (
            <>
              <Link to="/create" className="nav-link">Create Thread</Link>
              <Link to={`/profile/${userId}`} className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
