import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sems_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sems_token')
    if (token) {
      api
        .get('/api/auth/me')
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('sems_user', JSON.stringify(res.data))
        })
        .catch(() => {
          localStorage.removeItem('sems_token')
          localStorage.removeItem('sems_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('sems_token', res.data.access_token)
    localStorage.setItem('sems_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (payload) => {
    const res = await api.post('/api/auth/register', payload)
    localStorage.setItem('sems_token', res.data.access_token)
    localStorage.setItem('sems_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('sems_token')
    localStorage.removeItem('sems_user')
    setUser(null)
  }

  const updateUser = (updated) => {
    setUser(updated)
    localStorage.setItem('sems_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
