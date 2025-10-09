import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { threadAPI, categoryAPI, tagAPI } from '../services/api'
import './CreateThread.css'

const CreateThread = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: []
  })
  const [categories, setCategories] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        categoryAPI.getAll(),
        tagAPI.getAll()
      ])
      setCategories(categoriesRes.data.categories || categoriesRes.data || [])
      setAvailableTags(tagsRes.data.tags || tagsRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
      setCategories([])
      setAvailableTags([])
    }
  }

  const handleAddTag = (tagName) => {
    if (!formData.tags.includes(tagName) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tagName] })
    }
    setTagInput('')
  }

  const handleRemoveTag = (tagName) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagName) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert tag names to tag IDs
      const tagIds = formData.tags
        .map(tagName => {
          const tag = availableTags.find(t => t.name === tagName)
          return tag ? tag._id || tag.id : null
        })
        .filter(id => id !== null)

      const threadData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagIds
      }

      const response = await threadAPI.create(threadData)
      navigate(`/thread/${response.data._id}`)
    } catch (err) {
      console.error('Create thread error:', err)
      setError(err.response?.data?.message || 'Failed to create thread')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-thread">
      <div className="card">
        <h2>Create New Thread</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={200}
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              className="form-control"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              maxLength={10000}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tags (max 5)</label>
            <div className="tag-input-container">
              <input
                type="text"
                className="form-control"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Type to search tags..."
                list="tags-list"
              />
              <datalist id="tags-list">
                {availableTags.map(tag => (
                  <option key={tag._id || tag.id} value={tag.name} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="btn btn-secondary"
                disabled={!tagInput || formData.tags.length >= 5}
              >
                Add Tag
              </button>
            </div>
            <div className="selected-tags">
              {formData.tags.map(tag => (
                <span key={tag} className="tag-badge">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Thread'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateThread
