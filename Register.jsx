import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Building2, CalendarDays, AlertCircle, GraduationCap, BriefcaseBusiness } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    student_id: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register({ ...form, role })
      navigate(`/${user.role}/dashboard`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-950 dark:to-primary-950 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg card p-8"
      >
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl justify-center mb-8">
          <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white">
            <CalendarDays size={20} />
          </span>
          <span className="gradient-text">EventSphere</span>
        </Link>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
          Join as a student or faculty organizer
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all ${
              role === 'student'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white border-transparent shadow-md'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <GraduationCap size={16} /> Student
          </button>
          <button
            type="button"
            onClick={() => setRole('faculty')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all ${
              role === 'faculty'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white border-transparent shadow-md'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <BriefcaseBusiness size={16} /> Faculty
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          {role === 'student' && (
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                placeholder="Student ID"
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
