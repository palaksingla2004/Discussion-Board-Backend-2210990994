import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ThreadDetail from './pages/ThreadDetail'
import CreateThread from './pages/CreateThread'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  try {
    return (
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/thread/:id" element={<ThreadDetail />} />
                <Route path="/create" element={<PrivateRoute><CreateThread /></PrivateRoute>} />
                <Route path="/profile/:userId" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    )
  } catch (error) {
    console.error('App error:', error)
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    )
  }
}

export default App
