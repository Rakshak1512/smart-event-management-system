import React, { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import DashboardLayout from '../components/DashboardLayout'
import api from '../api/axios'

const TYPE_COLORS = {
  registration: 'bg-primary-500',
  reminder: 'bg-amber-500',
  attendance: 'bg-emerald-500',
  general: 'bg-slate-400',
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  const fetchData = async () => {
    const res = await api.get('/api/notifications')
    setNotifications(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const markRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`)
    fetchData()
  }

  const markAllRead = async () => {
    await api.put('/api/notifications/read-all')
    fetchData()
  }

  return (
    <DashboardLayout title="Notifications">
      <div className="flex justify-end mb-6">
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
          <CheckCheck size={16} /> Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">You're all caught up — no notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`card p-5 flex items-start gap-4 cursor-pointer ${
                !n.is_read ? 'border-l-4 border-l-primary-500' : ''
              }`}
            >
              <span className={`h-10 w-10 rounded-full ${TYPE_COLORS[n.type] || 'bg-slate-400'} flex items-center justify-center text-white shrink-0`}>
                <Bell size={18} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
              {!n.is_read && <span className="h-2.5 w-2.5 rounded-full bg-primary-500 shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
