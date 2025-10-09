import { useState, useEffect } from 'react'
import { threadAPI, categoryAPI } from '../services/api'
import ThreadCard from '../components/ThreadCard'
import './Home.css'

const Home = () => {
  const [threads, setThreads] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    sort: 'recent',
    search: ''
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [threadsRes, categoriesRes] = await Promise.all([
        threadAPI.getAll(filters),
        categoryAPI.getAll()
      ])
      
      console.log('Threads response:', threadsRes.data)
      console.log('Categories response:', categoriesRes.data)
      
      // Ensure threads is always an array
      let threadsData = threadsRes.data.threads || threadsRes.data || []
      if (!Array.isArray(threadsData)) {
        console.warn('Threads data is not an array:', threadsData)
        threadsData = []
      }
      
      // Ensure categories is always an array
      let categoriesData = categoriesRes.data.categories || categoriesRes.data || []
      if (!Array.isArray(categoriesData)) {
        console.warn('Categories data is not an array:', categoriesData)
        categoriesData = []
      }
      
      setThreads(threadsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      console.error('Error details:', error.response?.data)
      setError(error.response?.data?.message || error.message || 'Failed to load data')
      setThreads([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="loading">Loading threads...</div>
  }

  if (error) {
    return (
      <div className="home">
        <div className="card">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={loadData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Discussion Forum</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search threads..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories.map(cat => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-select"
          >
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
            <option value="votes">Most Voted</option>
          </select>
        </div>
      </div>
      <div className="threads-list">
        {!Array.isArray(threads) || threads.length === 0 ? (
          <div className="no-threads">
            <p>No threads found. Be the first to create one!</p>
          </div>
        ) : (
          threads.map(thread => (
            <ThreadCard key={thread._id} thread={thread} />
          ))
        )}
      </div>
    </div>
  )
}

export default Home
