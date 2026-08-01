import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sems_user')

      if (
        !stored ||
        stored === 'undefined' ||
        stored === 'null' ||
        stored.trim() === ''
      ) {
        return null
      }

      return JSON.parse(stored)
    } catch (error) {
      console.error('Invalid user data found in localStorage:', error)
      localStorage.removeItem('sems_user')
      localStorage.removeItem('sems_token')
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sems_token')

    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/api/auth/me')
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('sems_user', JSON.stringify(res.data))
      })
      .catch((error) => {
        console.error('Authentication failed:', error)

        localStorage.removeItem('sems_token')
        localStorage.removeItem('sems_user')
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', {
      email,
      password,
    })

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

  const updateUser = (updatedUser) => {
    setUser(updatedUser)

    if (updatedUser) {
      localStorage.setItem('sems_user', JSON.stringify(updatedUser))
    } else {
      localStorage.removeItem('sems_user')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}