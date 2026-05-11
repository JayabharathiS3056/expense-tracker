import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { AUTH_ENDPOINTS } from '../utils/apiPaths'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchUser()
    else setLoading(false)
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get(AUTH_ENDPOINTS.ME)
      setUser(data)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login      = (userData, token) => { localStorage.setItem('token', token); setUser(userData) }
  const logout     = () => { localStorage.removeItem('token'); setUser(null) }
  const updateUser = (u) => setUser(prev => ({ ...prev, ...u }))

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}