import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : ''

const axiosInstance = axios.create({
  baseURL: BASE,
  timeout: 12000,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance