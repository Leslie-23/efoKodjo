import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

export const getContent = () => api.get('/content').then((r) => r.data)
export const updateContent = (data) => api.put('/content', data).then((r) => r.data)
export const uploadImage = (file) => {
  const fd = new FormData()
  fd.append('image', file)
  return api.post('/content/upload', fd).then((r) => r.data)
}
