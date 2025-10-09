import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me')
}

export const threadAPI = {
  getAll: (params) => api.get('/threads', { params }),
  getById: (id) => api.get(`/threads/${id}`),
  create: (data) => api.post('/threads', data),
  update: (id, data) => api.put(`/threads/${id}`, data),
  delete: (id) => api.delete(`/threads/${id}`)
}

export const replyAPI = {
  create: (threadId, data) => api.post(`/replies/${threadId}`, data),
  update: (threadId, replyId, data) => api.put(`/replies/${threadId}/replies/${replyId}`, data),
  delete: (threadId, replyId) => api.delete(`/replies/${threadId}/replies/${replyId}`)
}

export const voteAPI = {
  voteThread: (threadId, type) => api.post(`/votes/threads/${threadId}`, { type }),
  voteReply: (threadId, replyId, type) => api.post(`/votes/threads/${threadId}/replies/${replyId}`, { type })
}

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`)
}

export const tagAPI = {
  getAll: () => api.get('/tags'),
  getPopular: () => api.get('/tags/popular'),
  suggest: (partial) => api.get(`/tags/suggest/${partial}`)
}

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserThreads: (userId) => api.get(`/users/${userId}/threads`)
}

export default api
