import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays, MapPin, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [filter, setFilter] = useState('registered')
  const navigate = useNavigate()

  const fetchData = async () => {
    const res = await api.get('/api/registrations/me')
    setRegistrations(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCancel = async (eventId) => {
    await api.delete(`/api/registrations/${eventId}`)
    fetchData()
  }

  const filtered = registrations.filter((r) => r.status === filter)

  return (
    <DashboardLayout title="My Registrations">
      <div className="flex gap-2 mb-8">
        {['registered', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md'
                : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No {filter} events found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/events/${r.event_id}`)}>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{r.event?.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {r.event && format(new Date(r.event.event_date), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {r.event?.venue}
                  </span>
                </div>
              </div>
              {filter === 'registered' && (
                <button
                  onClick={() => handleCancel(r.event_id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <XCircle size={16} /> Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
