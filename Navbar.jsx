import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Sun, Menu, X, CalendarDays } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Features', href: '/#features' },
    { label: 'Events', href: '/#events' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white">
            <CalendarDays size={20} />
          </span>
          <span className="gradient-text">EventSphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="btn-secondary !py-2"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="btn-primary !py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary !py-2">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn-primary !py-2">
                Get Started
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden glass border-t border-white/20 dark:border-white/5 px-6 py-4 flex flex-col gap-4"
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={toggleTheme} className="btn-secondary !py-2 flex-1">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          {user ? (
            <div className="flex gap-3">
              <button onClick={() => navigate(`/${user.role}/dashboard`)} className="btn-secondary !py-2 flex-1">
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="btn-primary !py-2 flex-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => navigate('/login')} className="btn-secondary !py-2 flex-1">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn-primary !py-2 flex-1">
                Get Started
              </button>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  )
}
