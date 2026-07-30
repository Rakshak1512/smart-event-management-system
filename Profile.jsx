import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    student_id: user?.student_id || '',
    phone: user?.phone || '',
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.put('/api/auth/me', form)
    updateUser(res.data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout title="Profile Settings">
      <div className="max-w-2xl">
        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          {saved && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle2 size={16} /> Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Department</label>
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            {user?.role === 'student' && (
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Student ID</label>
                <input
                  value={form.student_id}
                  onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
